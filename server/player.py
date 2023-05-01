from config import config


class Player:
    def __init__(self):
        self.money = 0
        self.position = [0, 0]
        self.inventory = []
        self.destination = [0, 0]
        self.speed = config['default_speed']

    def move(self):
        if self.destination == self.position:
            return
        # later fix case where diagonal movement is faster than horizontal/vertical
        self.position[0] = self.position[0] + self.speed * (self.destination[0] - self.position[0])
        self.position[1] = self.position[1] + self.speed * (self.destination[1] - self.position[1])

    def setDestination(self, x, y):
        self.destination = [x, y]

    def setSpeed(self, speed):
        self.speed = speed

    def addToInventory(self, item):
        self.inventory.append(item)
