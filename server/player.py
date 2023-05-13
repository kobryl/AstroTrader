from config import config


class Player:
    def __init__(self, name, id):
        self.money = 0
        self.position = [0, 0]
        self.inventory = []
        self.destination = [0, 0]
        self.speed = config['default_speed']
        self.name = name
        self.id = id

    def move(self, delta_time):
        if self.destination == self.position:
            return
        # later fix case where diagonal movement is faster than horizontal/vertical
        self.position[0] = self.position[0] + self.speed * (self.destination[0] - self.position[0]) * delta_time
        self.position[1] = self.position[1] + self.speed * (self.destination[1] - self.position[1]) * delta_time

    def setDestination(self, x, y):
        self.destination = [x, y]

    def setSpeed(self, speed):
        self.speed = speed

    def addToInventory(self, item):
        self.inventory.append(item)
