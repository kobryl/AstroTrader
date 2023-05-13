class Station {
    constructor(x, y) {
        this.sprite = null;
        this.targetMarker = null;
        this.initSprites();
        this.setPos(x, y);
    }

    initSprites() {
        this.sprite = new PIXI.Sprite(stationTexture);
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(Config.STATION_SCALE);
        this.sprite.eventMode = "static";
        this.sprite.cursor = "pointer";
        this.sprite.on("pointerover", this.showTargetMarker.bind(this));
        this.sprite.on("pointerout", this.hideTargetMarker.bind(this));
        this.sprite.on("click", this.onClick.bind(this));
        game.stage.addChild(this.sprite);

        this.targetMarker = new PIXI.Sprite(objectTargetTexture);
        this.targetMarker.anchor.set(0.5);
        this.targetMarker.scale.set(Config.OBJECT_TARGET_SCALE);
        this.targetMarker.alpha = Config.OBJECT_TARGET_ALPHA;
        this.targetMarker.eventMode = "none";
        this.targetMarker.visible = false;
        game.stage.addChild(this.targetMarker);
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
        this.sprite.x = x;
        this.sprite.y = y;
        this.targetMarker.x = x;
        this.targetMarker.y = y;
    }

    showTargetMarker() {
        this.targetMarker.visible = true;
    }

    hideTargetMarker() {  
        this.targetMarker.visible = false;
    }

    onClick(e) {
        e.stopPropagation();
        moveToObject(this);
    }
}