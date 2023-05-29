class Station extends InteractableObject {
    constructor(name, id, x, y) {
        super(x, y, stationTexture, Config.STATION_SCALE);
        this.name = name;
        this.id = id;
    }

    update(data) {
        super.update(data);
        this.name = data.name;
    }

    openMenu() {
        super.openMenu();
        
        const menu = document.querySelector("#active-menu");
        menu.querySelector(".object-name").innerHTML = this.name;
        menu.querySelector(".object-id").innerHTML = this.id;
        menu.querySelector(".object-type").innerHTML = "Station";
        menu.querySelector(".station-contents").style.display = "initial";
        menu.querySelector(".station-actions .check-button").onclick = () => { onCheckClick(); };
        populateStationItemList();
    }
}