import queue

import websockets
import asyncio
import threading

INET_ADDR = ""


class Server:
    def __init__(self):
        self.__clients = []
        self.__stop = asyncio.Future()
        self.__clients_lock = threading.Lock()
        self.__websocket_server = None
        self.__message_queue = queue.Queue()

    async def __handle_client(self, websocket, path):
        self.__clients_lock.acquire()
        player_id = len(self.__clients)
        self.__clients.append(websocket)
        self.__clients_lock.release()
        async for message in websocket:
            self.__message_queue.put((player_id, message))

    async def send_message(self, player_id, message):
        await self.__clients[player_id].send(message)

    async def broadcast(self, message: str) -> None:
        for client in self.__clients:
            await client.send(message)

    def start(self) -> None:
        asyncio.ensure_future(self.__run())

    async def __run(self):
        async with websockets.serve(self.__handle_client, INET_ADDR, 8765) as server:
            self.__websocket_server = server
            await self.__stop

    def get_message(self) -> tuple[int, str]:
        return self.__message_queue.get_nowait()

    def stop(self):
        self.__stop.set_result(True)
