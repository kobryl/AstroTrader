class Item {
    constructor(id, name, value) {
        this.id = id;
        this.name = name;
        this.value = value;
    }

    createPlayerListElement() {
        let itemElement = document.createElement("div");
        itemElement.classList.add("item");
        itemElement.classList.add("player-list-item");
        
        let itemName = document.createElement("div");
        itemName.classList.add("item-name");
        itemName.innerHTML = this.name;
        itemElement.appendChild(itemName);

        let itemValue = document.createElement("div");
        itemValue.classList.add("item-value");
        itemValue.innerHTML = this.value;
        itemElement.appendChild(itemValue);

        return itemElement;
    }

    createStationListElement() {

    }
}