import threading
import json
import asyncio
import random
import time
from player import Player
from config import config
from asteroid import Asteroid
from station import Station
from interface import Server


class Game:
    def __init__(self):
        self.state = 0
        self.players = []
        self.asteroids = []
        self.structures = []
        self.net_interface = Server()
        self.ticks_since_last_update = 0
        self.ticks_between_updates = config['ticks_to_update']
        self.ticks_since_last_economy_change = 0
        self.ticks_between_economy_changes = config['ticks_to_change_economy']
        self.map_size = config['map_size']
        self.starting_position = [config['player_start_x'], config['player_start_y']]

        # Define a new function that will start the server in a new thread
        def start_server():
            self.net_interface.start()

        # Create a new thread and start the server within the new thread
        server_thread = threading.Thread(target=start_server)
        server_thread.start()

        self.station = Station('PG', [config['station_start_x'], config['station_start_y']])
        self.structures.append(self.station.location.copy())
        self.structures.append(self.starting_position.copy())
        self.populate_asteroids()
        self.delta_time = 0
        self.last_frame_time = time.time()

    def get_player(self, player_id):
        for p in self.players:
            if p.id == player_id:
                return p

    def start(self):
        while self.state != 2:
            self.ticks_since_last_update += 1
            self.delta_time = time.time() - self.last_frame_time
            self.last_frame_time = time.time()
            self.handle_updates()
            self.calculate_economy()
            self.calculate_players()
            self.send_updates()
            time_of_tick = time.time() - self.last_frame_time
            if time_of_tick < 1.0 / config['ticks_per_second']:
                time.sleep(max(1.0 / config['ticks_per_second'] / 2 - time_of_tick, 0))
            for asteroid in self.asteroids:
                asteroid.update(self.delta_time)

    def calculate_economy(self):
        self.ticks_since_last_economy_change += 1
        if self.ticks_since_last_economy_change >= self.ticks_between_economy_changes:
            self.ticks_since_last_economy_change = 0
            self.station.fluctuate_prices()

    def calculate_players(self):
        for player in self.players:
            player.move(self.delta_time)

    def handle_check_event(self, player_id, message):
        player = self.get_player(player_id)
        item = None
        for it in player.inventory:
            if it.id == message["content"]["item"]:
                item = it
                break
        if item is None:
            return
        station = self.station
        price = station.check_price(item)
        update = {
            "type": "check_response",
            "content": {
                "id": message["content"]["item"],
                "price": str(price),
                "modifier": str(price / item.value)
            }
        }
        json_object = json.dumps(update)
        asyncio.run(self.net_interface.broadcast(json_object))

    def handle_sell_event(self, player_id, message):
        player = self.get_player(player_id)
        item = None
        for it in player.inventory:
            if it.id == message["content"]["item"]:
                item = it
                break
        if item is None:
            return
        station = self.station
        price = station.check_price(item)
        asked_price = message["content"]["price"]
        if str(price) != asked_price:
            self.send_outdated_price_notification(player, price)
        self.sell_item(player, item, station)

    def handle_updates(self):
        message = self.net_interface.get_message()
        if message is None:
            return
        player_id = message[0]
        message = message[1]
        if message == "":
            return
        message = json.loads(message)
        print(message)
        if "type" not in message:
            return
        if message["type"] == "join":
            self.add_player(message["content"]["player"]["name"], player_id)
        elif message["type"] == "move":
            player = message["content"]["player"]
            self.get_player(player_id).destination = player["destination"]
        elif message["type"] == "mine":
            asteroid_id = int(message["content"]["asteroid"])
            self.asteroids[asteroid_id].add_player(self.get_player(player_id))
        elif message["type"] == "check":
            self.handle_check_event(player_id, message)
        elif message["type"] == "sell":
            self.handle_sell_event(player_id, message)
        elif message["type"] == "disconnect":
            player = self.get_player(player_id)
            self.players.remove(player)
            print("Player " + player.name + " disconnected, player_id: " + str(player_id))

    def send_updates(self):
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
                "money": player.money
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

    def add_player(self, name, player_id):
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

    def give_item(self, player, item):
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

    def remove_item(self, player, item):
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

    def check_price(self, station, item):
        return station.check_price(item)

    def sell_item(self, player, item, station):
        value = station.buy_from_player(item)
        self.remove_item(player, item)
        self.add_money(player, value)

    def add_money(self, player, amount):
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

    def remove_money(self, player, amount):
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

    def populate_asteroids(self):
        for i in range(config['asteroid_count']):
            valid = False
            x, y = 0, 0
            while not valid:
                x = random.randint(0, self.map_size)
                y = random.randint(0, self.map_size)
                valid = self.is_valid_placement([x, y])
            richness = max(random.random(), 0.3)
            self.asteroids.append(Asteroid(richness, [x, y]))
            self.structures.append([x, y])
            print("Asteroid " + str(i) + " spawned at " + str([x, y]))

    def send_outdated_price_notification(self, player, actual_price):
        update = {
            "type": "sell",
            "content": {
                "status": "outdated",
                "actual_price": actual_price,
            }
        }
        json_object = json.dumps(update)
        asyncio.run(self.net_interface.send_message(player.id, json_object))

    def is_valid_placement(self, position):
        for structure in self.structures:
            if ((structure[0] - position[0]) ** 2 + (structure[1] - position[1]) ** 2) ** 0.5 < 200:
                return False
        return True

    def send_mining_update(self, player, progress):
        update = {
            "type": "mine_update",
            "content": {
                "progress": progress,
            }
        }
        json_object = json.dumps(update)
        asyncio.run(self.net_interface.send_message(player.id, json_object))
