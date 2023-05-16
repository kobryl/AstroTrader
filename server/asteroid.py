import random

from config import config, ore_names
from item import Item


def get_random_ore_name():
    names = ore_names
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
            if ((player.position[0] - self.location[0]) ** 2 + (player.position[1] - self.location[1]) ** 2) \
                    ** 0.5 < self.mining_radius and self.resources_left > 1:
                self.mining_players_progress[idx] += 1
                if self.mining_players_progress[idx] == self.current_mining_modifier:
                    self.mining_players_progress[idx] = 0
                    player.add_to_inventory(Item(get_random_ore_name(), self.richness))
                    self.resources_left -= 1
                player.game.send_mining_update(player, self.mining_players_progress[idx] / self.current_mining_modifier)
            else:
                self.mining_players_progress[idx] = -1
                player.game.send_mining_update(player, 0)

        new_player_list = []
        new_progress_list = []
        for idx, player in enumerate(self.mining_players):
            if self.mining_players_progress[idx] != -1:
                new_player_list.append(player)
                new_progress_list.append(self.mining_players_progress[idx])
        self.mining_players = new_player_list
        self.mining_players_progress = new_progress_list


    def add_player(self, player):
        self.mining_players.append(player)
        self.mining_players_progress.append(0)

    def replenish_asteroid(self, delta_time):
        self.resources_left += delta_time * config['asteroid_replenish_rate']
        self.resources_left = min(self.resources_left, config['max_asteroid_resources'])

    def update(self, delta_time):
        self.mine()
        self.replenish_asteroid(delta_time)
