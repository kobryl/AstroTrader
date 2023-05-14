class Asteroid extends InteractableObject {
    constructor(name, id, x, y, resLeft, richness) {
        super(x, y, asteroidTexture, Config.ASTEROID_SCALE);
        this.name = name;
        this.id = id;
        this.resourcesLeft = resLeft;
        this.richness = richness;
    }

    update(data) {
        super.update(data);
        this.name = data.name;
        this.resourcesLeft = data.resources_left;
        this.richness = data.richness;
    }
}