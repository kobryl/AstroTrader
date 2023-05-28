import random

from config import config, ore_names


class Station:
    def __init__(self, name, location):
        self.name = name
        self.location = location
        self.current_trade_modifier = config['default_station_trade_modifier']
        self.current_ore_modifier = dict(zip(ore_names, [1 for _ in range(len(ore_names))]))
        print(self.current_ore_modifier)

    def buy_from_player(self, item):
        worth = self.check_price(item)
        return worth

    def check_price(self, item):
        worth = item.value * self.current_trade_modifier * self.current_ore_modifier[item.name]
        return worth

    def fluctuate_prices(self):
        self.current_trade_modifier += (random.random() - 0.5) * config['market_fluctuation']
        for ore in ore_names:
            self.current_ore_modifier[ore] += (random.random() - 0.5) * config['ore_market_fluctuation']

