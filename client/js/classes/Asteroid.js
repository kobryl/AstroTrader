class Asteroid extends InteractableObject {
    constructor(id, x, y) {
        super(id, x, y, asteroidTexture, Config.ASTEROID_SCALE);
    }
}