class InteractableObject {
    constructor(x, y, texture, scale) {
        this.sprite = null;
        this.targetMarker = null;
        this.initSprites(texture, scale);
        this.setPos(x, y);
    }

    initSprites(texture, scale) {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(scale);
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

    update(data) {
        this.setPos(data.position[0], data.position[1]);
    }

    openMenu() {
        const menu = document.querySelector("#active-menu");
        menu.style.display = 'initial';
        menu.querySelector(".object-name").innerHTML = "Object";
        menu.querySelector(".object-id").innerHTML = 0;
        menu.querySelector(".object-type").innerHTML = "";
        
        const objectsContents = menu.querySelectorAll(".object-contents");
        objectsContents.forEach((element) => {
            element.style.display = "none";
        });
    }
}