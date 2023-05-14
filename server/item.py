class Item:
    item_count = 0

    def __init__(self, name, value):
        self.name = name
        self.value = value
        self.id = Item.item_count
        Item.item_count += 1
