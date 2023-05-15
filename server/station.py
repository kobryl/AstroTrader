from config import config


class Station:
    def __init__(self, name, location):
        self.name = name
        self.location = location
        self.current_trade_modifier = config['default_station_trade_modifier']

    def buy_from_player(self, item):
        worth = self.check_price(item)
        return worth

    def check_price(self, item):
        worth = item.worth * self.current_trade_modifier
        return worth
