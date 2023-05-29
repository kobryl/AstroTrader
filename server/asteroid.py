import random

from config import config, ore_names
from item import Item


def get_random_ore_name():
    names = ore_names
    idx = random.randint(0, len(ore_names) - 1)
    return ore_names[idx]

def get_random_asteroid_name():
    prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa']
    suffixes = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

    prefix = random.choice(prefixes)
    suffix = random.choice(suffixes)

    return prefix + "-" + suffix


class Asteroid:
    def __init__(self, richness, location):
        self.richness = richness
        self.location = location
        self.current_mining_modifier = config['default_asteroid_mining_modifier']
        self.mining_players = []
        self.mining_players_progress = []
        self.mining_radius = config['default_asteroid_mining_radius']
        self.name = get_random_asteroid_name()
        self.resources_left = config['max_asteroid_resources']

    def mine(self):
        for idx, player in enumerate(self.mining_players):
            if ((player.position[0] - self.location[0]) ** 2 + (player.position[1] - self.location[1]) ** 2) \
                    ** 0.5 < self.mining_radius and self.resources_left > 1:
                self.mining_players_progress[idx] += 1
                if self.mining_players_progress[idx] % 30 == 0:
                    player.game.send_mining_update(player, self.mining_players_progress[idx] / self.current_mining_modifier)
                if self.mining_players_progress[idx] == self.current_mining_modifier:
                    self.mining_players_progress[idx] = 0
                    ore_value = self.richness * config['ore_value_multiplier'] + random.uniform(-config['ore_value_random_range'], config['ore_value_random_range'])
                    player.add_to_inventory(Item(get_random_ore_name(), ore_value))
                    self.resources_left -= 1
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
        print("Added player to asteroid")
        print(self.mining_players)
        print(self.mining_players_progress)
        print("End of add player to asteroid")

    def replenish_asteroid(self, delta_time):
        self.resources_left += delta_time * config['asteroid_replenish_rate']
        self.resources_left = min(self.resources_left, config['max_asteroid_resources'])

    def update(self, delta_time):
        self.mine()
        self.replenish_asteroid(delta_time)
