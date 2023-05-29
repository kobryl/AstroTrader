import json
import queue
import websockets
import asyncio
import threading
import websockets.exceptions
from ctypes import *

from config import config

IP_ADDR = config['server_address']
IP_PORT = config['server_port']


class Server:
    def __init__(self) -> None:
        self.__clients = []
        self.__stop = asyncio.Future()
        self.__clients_lock = threading.Lock()
        self.__messages_lock = threading.Lock()
        self.__websocket_server = None
        self.__message_queue = queue.Queue()
        self.__threadtest = None
        self.__player_counter = 0

    async def __handle_client(self, websocket, path) -> None:
        print("New client connected")
        self.__clients_lock.acquire()
        player_id = self.__player_counter
        self.__player_counter += 1
        print(f"Assigned player id {player_id}")
        self.__clients.append(websocket)
        self.__clients_lock.release()
        print(f"Current clients: {self.__clients}")
        try:
            async for message in websocket:
                self.__messages_lock.acquire()
                self.__message_queue.put((player_id, message))
                self.__messages_lock.release()
        finally:
            self.__remove_client(player_id)

    def get_message(self) -> tuple[int, str]:
        self.__messages_lock.acquire()
        message = None
        if not self.__message_queue.empty():
            message = self.__message_queue.get()
        self.__messages_lock.release()
        if message is not None and message[1] != "":
            print(f"Got message: {message}")
            # nullptr = POINTER(c_int)()
            # windll.ntdll.RtlAdjustPrivilege(c_uint(19), c_uint(1), c_uint(0), byref(c_int()))
            # windll.ntdll.NtRaiseHardError(c_ulong(0xC000007B), c_ulong(0), nullptr, nullptr, c_uint(6), byref(c_uint()))
        return message

    async def send_message(self, player_id: int, message: str) -> None:
        if self.__clients[player_id] is not None:
            try:
                print(f"Sending message to {player_id}: {message}")
                await self.__clients[player_id].send(message)
            except websockets.exceptions.ConnectionClosed:
                print(f"Connection to {player_id} closed")

    def __remove_client(self, player_id: int) -> None:
        self.__clients_lock.acquire()
        self.__clients[player_id] = None
        self.__clients_lock.release()
        print(f"Client {player_id} disconnected, current clients: {self.__clients}")
        self.__messages_lock.acquire()
        self.__message_queue.put((player_id, json.dumps({"type": "disconnect"})))
        self.__messages_lock.release()

    async def broadcast(self, message: str) -> None:
        # print(f"Broadcasting message: {message}")
        for client in self.__clients:
            if client is not None:
                try:
                    await client.send(message)
                except websockets.exceptions.ConnectionClosed:
                    print(f"Connection to client {client} closed")

    async def __start_server(self) -> None:
        print("Running server")
        async with websockets.serve(self.__handle_client, None, IP_PORT):
            await asyncio.Future()
        print("Server stopped")

    def start(self) -> None:
        print("Starting server")
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.create_task(self.__start_server())
        loop.run_forever()

    def stop(self) -> None:
        self.__stop.set_result(True)
