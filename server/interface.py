import queue
import websockets
import asyncio
import threading

from config import config

INET_ADDR = config['server_address']
IP_PORT = config['server_port']

class Server:
    def __init__(self):
        self.__clients = []
        self.__stop = asyncio.Future()
        self.__clients_lock = threading.Lock()
        self.__messages_lock = threading.Lock()
        self.__websocket_server = None
        self.__message_queue = queue.Queue()
        self.__threadtest = None

    async def __handle_client(self, websocket, path):
        print("New client connected")
        self.__clients_lock.acquire()
        player_id = len(self.__clients)
        print(f"Assigned player id {player_id}")
        self.__clients.append(websocket)
        self.__clients_lock.release()
        print(f"Current clients: {self.__clients}")
        async for message in websocket:
            self.__messages_lock.acquire()
            self.__message_queue.put((player_id, message))
            self.__messages_lock.release()

    def get_message(self):
        player_id = len(self.__clients)
        self.__messages_lock.acquire()
        message = None
        if not self.__message_queue.empty():
            message = self.__message_queue.get()
        self.__messages_lock.release()
        print(f"Got message: {message}")
        return message

    async def send_message(self, player_id, message):
        print(f"Sending message to {player_id}: {message}")
        await self.__clients[player_id].send(message)

    async def broadcast(self, message: str) -> None:
        print(f"Broadcasting message: {message}")
        for client in self.__clients:
            await client.send(message)

    async def __start_server(self):
        print("Running server")
        async with websockets.serve(self.__handle_client, INET_ADDR, IP_PORT):
            await asyncio.Future()
        print("Server stopped")

    def start(self) -> None:
        print("Starting server")
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.create_task(self.__start_server())
        loop.run_forever()

    def stop(self):
        self.__stop.set_result(True)