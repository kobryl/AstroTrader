class Station extends InteractableObject {
    constructor(name, id, x, y) {
        super(x, y, stationTexture, Config.STATION_SCALE);
        this.name = name;
        this.id = id;
    }
}