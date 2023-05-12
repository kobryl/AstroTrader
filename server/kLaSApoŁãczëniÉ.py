import queue

import websockets
import asyncio
import json
import threading

class Server:
    def __init__(self):
        self.__clients = []
        self.__lock = threading.Lock()
        self.__websocket_server = None
        self.__message_queue = queue.Queue()

    async def __handle_client(self, websocket, path):
        self.__lock.acquire()
        self.__clients.append(websocket)
        self.__lock.release()
        async for message in websocket:
            self.__message_queue.put((websocket, message))

    def start(self):
        self.__websocket_server = asyncio.ensure_future(websockets.serve(self.__handle_client, "localhost", 8765))
