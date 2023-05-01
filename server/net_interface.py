import asyncio
import socket
from asyncio import StreamReader, StreamWriter

TCP_IP = '192.168.0.3'
TCP_PORT = 8080
BUFFER_SIZE = 1024


connections: list[tuple[StreamReader, StreamWriter]] = []
server = None


async def start_server() -> None:
    server = await asyncio.start_server(listen, TCP_IP, TCP_PORT)
    addrs = ', '.join(str(sock.getsockname()) for sock in server.sockets)
    print(f'Serving on {addrs}')

    async with server:
        await server.serve_forever()


def listen(client_reader, client_writer):
    connections.append((client_reader, client_writer))
    print("KTO")


async def send_to_all(message: bytes) -> None:
    for conn in connections:
        conn[1].write(message)
        await conn[1].drain()


async def send_to(client_id: int, message: bytes) -> None:
    connections[client_id][1].write(message)
    await connections[client_id][1].drain()


def close():
    for conn in connections:
        conn[1].close()

asyncio.run(start_server())
print("tf")
