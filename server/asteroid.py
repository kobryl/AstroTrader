import random

from config import config
from item import Item

# TODO: reformat to snake case pls
def getRandomOreName():
    ore_names = [
        "Iron",
        "Copper",
        "Silver",
        "Gold",
        "Platinum",
        "Diamond",
        "Emerald",
        "Ruby",
        "Sapphire",
        "Titanium",
        "Uranium",
        "Plutonium",
        "Tungsten",
        "Tin",
        "Lead",
        "Zinc",
        "Nickel",
        "Cobalt",
        "Chromium",
        "Bismuth",
    ]
    idx = random.randint(0, len(ore_names) - 1)
    return ore_names[idx]


class Asteroid:
    def __init__(self, richness, location):
        self.richness = richness
        self.location = location
        self.current_mining_modifier = config['default_asteroid_mining_modifier']
        self.mining_players = []
        self.mining_players_progress = []
        self.mining_radius = config['default_asteroid_mining_radius']
        self.name = "Asteroid"
        self.resources_left = config['max_asteroid_resources']

    def mine(self):
        for idx, player in enumerate(self.mining_players):
            if ((player.position[0] - self.location[0]) ** 2 + (player.position[1] - self.location[1]) ** 2) ** 0.5 < self.mining_radius and self.resources_left > 1:
                self.mining_players_progress[idx] += 1
                if self.mining_players_progress[idx] == self.current_mining_modifier:
                    self.mining_players_progress[idx] = 0
                    player.addToInventory(Item(getRandomOreName(), self.richness))
                    self.resources_left -= 1
                player.game.sendMiningUpdate(player, self.mining_players_progress[idx]/self.current_mining_modifier)
            else:
                del self.mining_players[idx]
                del self.mining_players_progress[idx]
                player.game.sendMiningUpdate(player, 0)

    def addPlayer(self, player):
        self.mining_players.append(player)
        self.mining_players_progress.append(0)