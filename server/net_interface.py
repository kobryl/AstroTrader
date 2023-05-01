import asyncio
import socket
from asyncio import StreamReader, StreamWriter

TCP_IP = ''
TCP_PORT = 5005
BUFFER_SIZE = 1024


class Connections:
    def __init__(self):
        self.connections: list[tuple[StreamReader, StreamWriter]] = []
        self.server = await asyncio.start_server(self.listen, TCP_IP, TCP_PORT)
        self.addrs = ', '.join(str(sock.getsockname()) for sock in self.server.sockets)
        print(f'Serving on {self.addrs}')

        async with self.server:
            await self.server.serve_forever()

    def listen(self, client_reader, client_writer):
        self.connections.append((client_reader, client_writer))
        print("KTO")

    def send_to_all(self, message: bytes) -> None:
        for conn in self.connections:
            conn[1].write(message)
            await conn[1].drain()

    def send_to(self, client_id: int, message: bytes) -> None:
        self.connections[client_id][1].write(message)
        await self.connections[client_id][1].drain()

    def close(self):
        for conn in self.connections:
            conn[1].close()
        self.server.close()
