from config import config

# TODO: reformat to snake case pls

class Station:
    def __init__(self, name, location):
        self.name = name
        self.location = location
        self.current_trade_modifier = config['default_station_trade_modifier']

    def buyFromPlayer(self, item):
        worth = self.checkPrice(item)
        return worth

    def checkPrice(self, item):
        worth = item.worth * self.current_trade_modifier
        return worth
