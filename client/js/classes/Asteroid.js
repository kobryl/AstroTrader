class Asteroid extends InteractableObject {
    constructor(name, id, x, y) {
        super(x, y, asteroidTexture, Config.ASTEROID_SCALE);
        this.name = name;
        this.id = id;
    }
}