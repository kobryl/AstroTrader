import math

from config import config


class Player:
    def __init__(self, name, player_id, game):
        self.money = 0
        self.position = [0, 0]
        self.inventory = []
        self.destination = None
        self.speed = config['default_speed']
        self.name = name
        self.id = player_id
        self.game = game

    def move(self, delta_time):
        if self.destination == self.position:
            return
        if self.destination is None:
            return
        # later fix case where diagonal movement is faster than horizontal/vertical
        dx = self.destination[0] - self.position[0]
        dy = self.destination[1] - self.position[1]
        angle = math.atan2(dy, dx)
        x = self.speed * delta_time * math.cos(angle)
        y = self.speed * delta_time * math.sin(angle)
        self.position[0] += x
        self.position[1] += y
        if abs(self.destination[0] - self.position[0]) < self.speed * delta_time:
            self.position[0] = self.destination[0]
        if abs(self.destination[1] - self.position[1]) < self.speed * delta_time:
            self.position[1] = self.destination[1]
        if self.position == self.destination:
            self.destination = None

    def setDestination(self, x, y):
        self.destination = [x, y]

    def setSpeed(self, speed):
        self.speed = speed

    def addToInventory(self, item):
        self.game.giveItem(self, item)
