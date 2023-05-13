import asyncio
import json

from websockets.sync.client import connect

from config import config

INET_ADDR = config['server_address']
IP_PORT = config['server_port']


def hello():
    join = {
        "type": "join",
        "content": {
            "player": {
                "name": "Very dummy client",
            },
        }
    }
    update = {
        "type": "update",
        "content": {
            "player": {
                "destination": [300, 300],
            },
        }
    }
    join = json.dumps(join)
    update = json.dumps(update)
    with connect("ws://" + str(INET_ADDR) + ":" + str(IP_PORT)) as websocket:
        websocket.send(join)
        websocket.send(update)
        while True:
            message = websocket.recv()
            print(f"Received: {message}")


if __name__ == '__main__':
    hello()
