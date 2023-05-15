import threading

from player import Player
from config import config
from server.asteroid import Asteroid
from station import Station
from interface import Server
import json
import asyncio

import random
import time


class Game:
    def __init__(self):
        self.state = 0
        self.players = []
        self.asteroids = []
        self.structures = []
        #self.stations = []
        self.net_interface = Server()
        self.ticks_since_last_update = 0
        self.ticks_between_updates = config['ticks_to_update']
        self.ticks_since_last_economy_change = 0
        self.ticks_between_economy_changes = config['ticks_to_change_economy']
        self.map_size = config['map_size']
        self.starting_position = [config['player_start_x'], config['player_start_y']]
        self.populateAsteroids()

        # Define a new function that will start the server in a new thread
        def start_server():
            self.net_interface.start()

        # Create a new thread and start the server within the new thread
        server_thread = threading.Thread(target=start_server)
        server_thread.start()

        self.station = Station('PG', [self.starting_position[0] - 300, self.starting_position[1]])
        self.structures.append(self.station.location)
        self.structures.append(self.starting_position)
        self.delta_time = 0
        self.last_frame_time = time.time()

    def getPlayer(self, player_id):
        for p in self.players:
            if p.id == player_id:
                return p

    def start(self):
        while self.state != 2:
            self.ticks_since_last_update += 1
            self.delta_time = time.time() - self.last_frame_time
            self.last_frame_time = time.time()
            self.handleUpdates()
            self.calculateEconomy()
            self.calculatePlayers()
            self.sendUpdates()
            time_of_tick = time.time() - self.last_frame_time
            if time_of_tick < 0.0167:
                time.sleep(max(0.00817 - time_of_tick, 0))

    def calculateEconomy(self):
        self.ticks_since_last_economy_change += 1
        if self.ticks_since_last_economy_change >= self.ticks_between_economy_changes:
            self.ticks_since_last_economy_change = 0
            self.station.current_trade_modifier += (random.random() - 0.5) * config['market_fluctuation']

    def calculatePlayers(self):
        for player in self.players:
            player.move(self.delta_time)

    def handleUpdates(self):
        message = self.net_interface.get_message()
        if message is None:
            return
        player_id = message[0]
        message = message[1]
        message = json.loads(message)
        if message["type"] == "join":
            print(message)
            self.addPlayer(message["content"]["player"]["name"], player_id)
        elif message["type"] == "move":
            print(message)
            player = message["content"]["player"]
            self.getPlayer(player_id).destination = player["destination"]
        elif message["type"] == "mine":
            print(message)
            asteroid_id = message["content"]["asteroid"]
            self.asteroids[asteroid_id].mining_players.append(self.getPlayer(player_id))
            self.getPlayer(player_id).mine()
        elif message["type"] == "check":
            print(message)
            player = self.getPlayer(player_id)
            item = player.inventory[message["content"]["item"]]
            station = self.station # self.stations[message["content"]["station"]]
            value = station.checkPrice(item)
            update = {
                "type": "check",
                "content": {
                    "value": str(value),
                }
            }
            json_object = json.dumps(update)
            asyncio.run(self.net_interface.broadcast(json_object))
        elif message["type"] == "sell":
            print(message)
            player = self.getPlayer(player_id)
            item = player.inventory[message["content"]["item"]]
            station = self.station # self.stations[message["content"]["station"]]
            value = station.checkPrice(item)
            asked_price = message["content"]["price"]
            if value != asked_price:
                self.sendOutdatedPriceNotification(player)
            self.sellItem(player, item, station)
        elif message["type"] == "disconnect":
            player = self.getPlayer(player_id)
            self.players.remove(player)
            print("Player " + player.name + " disconnected, player_id: " + str(player_id))

    def sendUpdates(self):
        if self.ticks_since_last_update < self.ticks_between_updates:
            return
        if len(self.players) == 0:
            return
        self.ticks_since_last_update = 0
        update = {
            "type": "update",
            "content": {
                "players": {},
                "asteroids": {},
                "station": {},
                "server_delta_time": self.delta_time,
            }
        }
        for player in self.players:
            update["content"]["players"][player.id] = {
                "name": player.name,
                "position": player.position,
                "destination": player.destination,
                "speed": player.speed,
            }
        for idx, asteroid in enumerate(self.asteroids):
            update["content"]["asteroids"][idx] = {
                "position": asteroid.location,
                "richness": asteroid.richness,
                "name": asteroid.name,
                "resources_left": asteroid.resources_left,
            }
        update["content"]["station"] = {
            "position": self.station.location,
            "name": self.station.name,
        }
        json_object = json.dumps(update)
        asyncio.run(self.net_interface.broadcast(json_object))

    def addPlayer(self, name, player_id):
        player = Player(name, player_id, self)
        player.position = self.starting_position.copy()
        self.players.append(player)
        update = {
            "type": "connection",
            "content": {
                "status": "ok",
                "id": player_id,
            }
        }
        json_object = json.dumps(update)
        asyncio.run(self.net_interface.send_message(player.id, json_object))

    def giveItem(self, player, item):
        player.inventory.append(item)
        update = {
            "type": "item",
            "content": {
                "action": "add",
                "name": item.name,
                "value": item.value,
                "id": item.id,
            }
        }
        json_object = json.dumps(update)
        asyncio.run(self.net_interface.send_message(player.id, json_object))

    def removeItem(self, player, item):
        player.inventory.remove(item)
        update = {
            "type": "item",
            "content": {
                "action": "remove",
                "id": item.id,
            }
        }
        json_object = json.dumps(update)
        asyncio.run(self.net_interface.send_message(player.id, json_object))

    def checkPrice(self, station, item):
        return station.checkPrice(item)

    def sellItem(self, player, item, station):
        value = station.buyFromPlayer(item)
        self.removeItem(player, item)
        self.addMoney(player, item.value)

    def addMoney(self, player, amount):
        player.money += amount
        update = {
            "type": "money",
            "content": {
                "action": "add",
                "amount": amount,
            }
        }
        json_object = json.dumps(update)
        asyncio.run(self.net_interface.send_message(player.id, json_object))

    def removeMoney(self, player, amount):
        player.money -= amount
        update = {
            "type": "money",
            "content": {
                "action": "remove",
                "amount": amount,
            }
        }
        json_object = json.dumps(update)
        asyncio.run(self.net_interface.send_message(player.id, json_object))

    def populateAsteroids(self):
        for i in range(config['asteroid_count']):
            valid = False
            x, y = 0, 0
            while not valid:
                x = random.randint(0, self.map_size)
                y = random.randint(0, self.map_size)
                valid = self.isValidPlacement([x, y])
            richness = max(random.random(), 0.3)
            self.asteroids.append(Asteroid(richness, [x, y]))

    def sendOutdatedPriceNotification(self, player):
        update = {
            "type": "sell",
            "content": {
                "status": "outdated",
            }
        }
        json_object = json.dumps(update)
        asyncio.run(self.net_interface.send_message(player.id, json_object))

    def isValidPlacement(self, position):
        for structure in self.structures:
            if ((structure.location[0] - position[0]) ** 2 + (structure.location[1] - position[1]) ** 2) ** 0.5 < 200:
                return False
        return True

    def sendMiningUpdate(self, progress, player):
        update = {
            "type": "mining",
            "content": {
                "progress": progress,
            }
        }
        json_object = json.dumps(update)
        asyncio.run(self.net_interface.send_message(player.id, json_object))

    def replenishAsteroids(self):
        for asteroid in self.asteroids:
            asteroid.resources_left += min(self.delta_time * config['asteroid_replenish_rate'], config['max_asteroid_resources'])

