from player import Player
from config import config
from station import Station
import random
import time


class Game:
    def __init__(self):
        self.state = 0
        self.players = []
        self.net_interface = None
        self.station = Station('PG', [0, 0])
        self.delta_time = 0
        self.last_frame_time = time.time()

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
