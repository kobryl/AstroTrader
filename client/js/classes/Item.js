class Item {
    constructor(id, name, value) {
        this.id = id;
        this.name = name;
        this.value = value;
        this.askingPrice = 0;
    }

    createPlayerListElement() {
        let itemElement = document.createElement("div");
        itemElement.classList.add("item");
        itemElement.classList.add("player-list-item");

        let itemIcon = document.createElement("div");
        itemIcon.classList.add("item-icon");
        itemIcon.style.background = mineralColors.get(this.name);
        itemElement.appendChild(itemIcon);
        
        let itemName = document.createElement("div");
        itemName.classList.add("item-name");
        itemName.innerHTML = this.name;
        itemElement.appendChild(itemName);

        let itemValue = document.createElement("div");
        itemValue.classList.add("item-value");
        itemValue.innerHTML = Math.round(this.value * 100) / 100;
        itemElement.appendChild(itemValue);

        return itemElement;
    }

    createStationListElement(price, modifier) {
        let itemElement = document.createElement("div");
        itemElement.classList.add("item");
        itemElement.classList.add("station-list-item");
        itemElement.classList.add("item-" + this.id);

        let itemIcon = document.createElement("div");
        itemIcon.classList.add("item-icon");
        itemIcon.style.background = mineralColors.get(this.name);
        itemElement.appendChild(itemIcon);
        
        let itemName = document.createElement("div");
        itemName.classList.add("item-name");
        itemName.innerHTML = this.name;
        itemElement.appendChild(itemName);

        let itemValue = document.createElement("div");
        itemValue.classList.add("item-value");
        itemValue.innerHTML = Math.round(price * 100) / 100 + " $";
        itemElement.appendChild(itemValue);

        let itemModifier = document.createElement("div");
        itemModifier.classList.add("item-modifier");
        if (modifier > 1) {
            itemModifier.classList.add("item-modifier-positive");
            itemModifier.classList.remove("item-modifier-negative");
            itemModifier.innerHTML = "+";
        }
        else {
            itemModifier.classList.add("item-modifier-negative");
            itemModifier.classList.remove("item-modifier-positive");
            itemModifier.innerHTML = "";
        }
        itemModifier.innerHTML += Math.round((modifier - 1) * 10000) / 100 + "%";
        itemElement.appendChild(itemModifier);

        let sellButton = document.createElement("button");
        sellButton.classList.add("button");
        sellButton.classList.add("menu-button");
        sellButton.classList.add("item-sell-button");
        sellButton.innerHTML = "Sell";
        sellButton.onclick = () => { onSellClick(this); };
        itemElement.appendChild(sellButton);

        return itemElement;
    }
}