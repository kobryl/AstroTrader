class Asteroid {
    constructor(x, y) {
        this.sprite = null;
        this.initSprite();
        this.setPos(x, y);
    }

    initSprite() {
        this.sprite = new PIXI.Sprite(asteroidTexture);
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(Config.ASTEROID_SCALE);
        game.stage.addChild(this.sprite);
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
        this.sprite.x = x;
        this.sprite.y = y;
    }
}