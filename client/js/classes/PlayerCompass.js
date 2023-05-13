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
            object.sprite.y = y;
            object.label.x = x;
            object.label.y = y + Config.COMPASS_OBJECT_LABEL_OFFSET;
            object.label.text = Math.round(dist, 0);
            
            let alpha = 1;
            if (dist <= Config.COMPASS_OBJECT_COMPLETE_FADE_DISTANCE) {
                alpha = 0;
            }
            else if (dist <= Config.COMPASS_OBJECT_FADE_DISTANCE) {
                alpha *= (dist - Config.COMPASS_OBJECT_COMPLETE_FADE_DISTANCE) / 
                    (Config.COMPASS_OBJECT_FADE_DISTANCE - Config.COMPASS_OBJECT_COMPLETE_FADE_DISTANCE);
            }
            object.sprite.alpha = alpha;
            object.label.alpha = alpha;
        });
    }

    addObject(object) {
        let compassObject = new PlayerCompassObject(object);
        this.objects.push(compassObject);
        this.objectContainer.addChild(compassObject.sprite);
        this.objectContainer.addChild(compassObject.label);
    }
}

class PlayerCompassObject {
    constructor(object) {
        this.object = object;
        this.sprite = null;
        this.label = null;
        this.initObjects();
    }

    initObjects() {
        if (this.object instanceof Asteroid) {
            this.sprite = new PIXI.Sprite(asteroidTexture);
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(Config.ASTEROID_SCALE * Config.COMPASS_OBJECT_SCALE_MULT);
        }
        else if (this.object instanceof Station) {
            this.sprite = new PIXI.Sprite(stationTexture);
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(Config.STATION_SCALE * Config.COMPASS_OBJECT_SCALE_MULT);
        }

        this.label = new PIXI.Text("0", {
            fontFamily: 'Arial', 
            fontSize: Config.COMPASS_OBJECT_LABEL_FONT_SIZE, 
            fill: Config.COMPASS_LABEL_COLOR
        });
        this.label.anchor.set(0.5);
    }
}