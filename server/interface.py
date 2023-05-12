import queue

import websockets
import asyncio
import threading

INET_ADDR = ""


class Server:
    def __init__(self):
        self.__clients = []
        self.__clients_lock = threading.Lock()
        self.__websocket_server = None
        self.__message_queue = queue.Queue()

    async def __handle_client(self, websocket, path):
        self.__clients_lock.acquire()
        self.__clients.append(websocket)
        self.__clients_lock.release()
        async for message in websocket:
            self.__message_queue.put((websocket, message))

    async def send_message(self, player_id, message):
        await self.__clients[player_id].send(message)

    async def broadcast(self, message):
        for client in self.__clients:
            await client.send(message)

    def start(self):
        self.__websocket_server = asyncio.ensure_future(websockets.serve(self.__handle_client, INET_ADDR, 8001))

    def get_message(self):
        return self.__message_queue.get_nowait()

    def stop(self):
        self.__websocket_server.cancel()
