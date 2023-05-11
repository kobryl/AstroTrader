import asyncio
import json
import queue

import websockets

from game import Game

connected_clients = set()               # a set of connected clients
game = Game()                           # the game object
messages = queue.Queue()                # a queue of messages received from clients


async def error(websocket, message):
    await websocket.send(json.dumps({"type": "error", "message": message}))


async def sendGameState(websocket):
    game_state = {

    }
    await websocket.send(json.dumps(game_state))
    raise NotImplementedError


async def play(websocket, clients: set):
    update_flag = False
    async for message in websocket:
        event = json.loads(message)
        messages.put((websocket, event))
        if event["type"] == "move":
            raise NotImplementedError
        elif event["type"] == "buy":
            raise NotImplementedError
        elif event["type"] == "sell":
            raise NotImplementedError
        elif event["type"] == "mine":
            raise NotImplementedError
        else:
            await error(websocket, "Unknown event type")
        if update_flag:
            update_event = {
                "type": "update",
                "content": {
                    "stations": {

                    },
                    "players": {

                    }
                }
            }
            websockets.broadcast(clients, json.dumps(update_event))
            update_flag = False
            raise NotImplementedError


async def join(websocket, clients: set):
    clients.add(websocket)
    try:
        await sendGameState(websocket)
        await play(websocket, clients)
    finally:
        clients.remove(websocket)


async def handler(websocket):
    message = await websocket.recv()
    print(message)
    event = json.loads(message)
    assert event["type"] == "init"
    game.players.append(event["content"]["name"])
    await join(websocket, connected_clients)


async def main():
    async with websockets.serve(handler, "", 8001, ):
        await asyncio.Future()


if __name__ == "__main__":
    game.start()
    asyncio.run(main())
