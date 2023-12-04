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

    def set_destination(self, x, y):
        self.destination = [x, y]

    def set_speed(self, speed):
        self.speed = speed

    def add_to_inventory(self, item):
        self.game.give_item(self, item)

    def send_mining_notification(self, progress):
        self.game.send_mining_notification(self, progress)
