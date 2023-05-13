class Station extends InteractableObject {
    constructor(id, x, y) {
        super(id, x, y, stationTexture, Config.STATION_SCALE);
    }
}