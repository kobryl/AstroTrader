from player import Player
from config import config
from station import Station
import random


class Game:
    def __init__(self):
        self.state = 0
        self.players = []
        self.net_interface = None
        self.station = Station('PG', [0, 0])

    def start(self):
        while self.state != 2:
            self.handleUpdates()
            self.calculateEconomy()
            self.calculatePlayers()
            self.sendUpdates()

    def calculateEconomy(self):
        self.station.current_trade_modifier += random.random() * config['market_fluctuation']

    def calculatePlayers(self):
        for player in self.players:
            player.move()

    def handleUpdates(self):
        pass

    def sendUpdates(self):
        pass
