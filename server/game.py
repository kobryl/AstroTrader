import threading

from player import Player
from config import config
from station import Station
from interface import Server
import asyncio

import random
import time


class Game:
    def __init__(self):
        self.state = 0
        self.players = []
        self.net_interface = Server()


        # Define a new function that will start the server in a new thread
        def start_server():
            self.net_interface.start()

        # Create a new thread and start the server within the new thread
        server_thread = threading.Thread(target=start_server)
        server_thread.start()


        self.station = Station('PG', [0, 0])
        self.delta_time = 0
        self.last_frame_time = time.time()
        print("test:)")

    def start(self):
        while self.state != 2:
            self.delta_time = time.time() - self.last_frame_time
            self.last_frame_time = time.time()
            self.handleUpdates()
            self.calculateEconomy()
            self.calculatePlayers()
            self.sendUpdates()


    def calculateEconomy(self):
        self.station.current_trade_modifier += random.random() * config['market_fluctuation']

    def calculatePlayers(self):
        for player in self.players:
            player.move(self.delta_time)

    def handleUpdates(self):
        pass

    def sendUpdates(self) -> dict[any]:

        update = {
                "type": "update",
                "content": {
                    "stations": {

                    },
                    "players": {

                    }
                }
            }
        pass

    def getState(self):
        pass

    def addPlayer(self, name):
        player = Player(name)
        self.players.append(player)
