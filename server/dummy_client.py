import asyncio
from websockets.sync.client import connect

from config import config

INET_ADDR = config['server_address']
IP_PORT = config['server_port']

def hello():
    with connect("ws://" + str(INET_ADDR) + ":" + str(IP_PORT)) as websocket:
        websocket.send("Joined")
        while(True):
            message = websocket.recv()
            print(f"Received: {message}")

if __name__ == '__main__':
    hello()
