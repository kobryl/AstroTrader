class PlayerCompass {
    constructor(x, y) {
        this.objects = [];
        this.objectContainer = null;
        this.initContainer();
        this.setPos(x, y);
    }

    initContainer() {
        this.objectContainer = new PIXI.Container();
        game.stage.addChild(this.objectContainer);
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
        this.objectContainer.x = x;
        this.objectContainer.y = y;
    }

    update() {
        this.objects.forEach(object => {
            const dx = object.object.x - this.x;
            const dy = object.object.y - this.y;
            const angle = Math.atan2(dy, dx);
            const x = Config.COMPASS_RADIUS * Math.cos(angle);
            const y = Config.COMPASS_RADIUS * Math.sin(angle);
            const dist = Math.sqrt(dx * dx + dy * dy);
            object.sprite.x = x;
            object.sprite.y = y + Config.COMPASS_ICON_OFFSET;
            object.arrow.x = x + Config.COMPASS_ARROW_OFFSET * Math.cos(angle);
            object.arrow.y = y + Config.COMPASS_ARROW_OFFSET * Math.sin(angle);
            object.arrow.rotation = angle + Config.COMPASS_ARROW_ROTATION_OFFSET;
            object.label.x = x;
            object.label.y = y + Config.COMPASS_LABEL_OFFSET;
            object.label.text = Math.round(dist, 0);
            
            let alpha = 1;
            if (dist <= Config.COMPASS_COMPLETE_FADE_DISTANCE) {
                alpha = 0;
            }
            else if (dist <= Config.COMPASS_FADE_DISTANCE) {
                alpha *= (dist - Config.COMPASS_COMPLETE_FADE_DISTANCE) / 
                    (Config.COMPASS_FADE_DISTANCE - Config.COMPASS_COMPLETE_FADE_DISTANCE);
            }
            object.sprite.alpha = alpha;
            object.arrow.alpha = alpha;
            object.label.alpha = alpha;
        });
    }

    addObject(object) {
        let compassObject = new PlayerCompassObject(object);
        this.objects.push(compassObject);
        this.objectContainer.addChild(compassObject.sprite);
        this.objectContainer.addChild(compassObject.label);
        this.objectContainer.addChild(compassObject.arrow);
    }
}

class PlayerCompassObject {
    constructor(object) {
        this.object = object;
        this.sprite = null;
        this.arrow = null;
        this.label = null;
        this.initObjects();
    }

    initObjects() {
        if (this.object instanceof Asteroid) {
            this.sprite = new PIXI.Sprite(asteroidTexture);
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(Config.ASTEROID_SCALE * Config.COMPASS_SCALE_MULT);
        }
        else if (this.object instanceof Station) {
            this.sprite = new PIXI.Sprite(stationTexture);
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(Config.STATION_SCALE * Config.COMPASS_SCALE_MULT);
        }

        this.arrow = new PIXI.Sprite(arrowTexture);
        this.arrow.anchor.set(0.5);
        this.arrow.scale.set(Config.COMPASS_ARROW_SCALE);

        this.label = new PIXI.Text("0", {
            fontFamily: 'Arial', 
            fontSize: Config.COMPASS_LABEL_FONT_SIZE, 
            fill: Config.COMPASS_LABEL_COLOR
        });
        this.label.anchor.set(0.5);
    }
}