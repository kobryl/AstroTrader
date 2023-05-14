class Asteroid extends InteractableObject {
    constructor(name, id, x, y, res_left, richness) {
        super(x, y, asteroidTexture, Config.ASTEROID_SCALE);
        this.name = name;
        this.id = id;
        this.res_left = res_left;
        this.richness = richness;
    }

    update(data) {
        super.update(data);
        this.name = data.name;
        this.res_left = data.res_left;
        this.richness = data.richness;
    }
}