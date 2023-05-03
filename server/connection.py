import asyncio
import json
import websockets

from game import Game

CONNECTED_CLIENTS = set()
GAME = Game()
UPDATE_FLAG = False


async def error(websocket, message):
    await websocket.send(json.dumps({"type": "error", "message": message}))


async def sendGameState(websocket, game: Game):
    await websocket.send(json.dumps({}))
    raise NotImplementedError


async def play(websocket, connected_clients: set, game: Game):
    async for message in websocket:
        event = json.loads(message)
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
        if UPDATE_FLAG:
            update_event = {

            }
            websockets.broadcast(connected_clients, json.dumps(update_event))
            raise NotImplementedError


async def join(websocket, connected_clients: set, game: Game):
    connected_clients.add(websocket)
    try:
        await sendGameState(websocket, game)
        await play(websocket, connected_clients, game)
    finally:
        connected_clients.remove(websocket)


async def handler(websocket):
    message = await websocket.recv()
    print(message)
    event = json.loads(message)
    assert event["type"] == "init"

    await join(websocket, CONNECTED_CLIENTS, GAME)


async def main():
    async with websockets.serve(handler, "", 8001, ):
        await asyncio.Future()


if __name__ == "__main__":
    GAME.start()
    asyncio.run(main())
