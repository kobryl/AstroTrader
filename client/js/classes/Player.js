class Player {
    constructor(name, x, y) {
        this.name = name;
        this.ship = null;
        this.nameTag = null;
        this.movementTarget = null;
        this.movementTargetLine = null;
        this.destinationPoint = null;
        this.interactionObject = null;
        this.initPlayerObjects();
        this.setPos(x, y);
    }

    initPlayerObjects() {
        this.movementTarget = new PIXI.Sprite(movementTargetTexture);
        this.movementTarget.anchor.set(0.5);
        this.movementTarget.x = 0;
        this.movementTarget.y = 0;
        this.movementTarget.scale.set(Config.MOVEMENT_TARGET_SCALE);
        this.movementTarget.alpha = Config.MOVEMENT_TARGET_ALPHA;
        this.movementTarget.visible = false;

        this.movementTargetLine = new PIXI.Graphics();

        this.ship = new PIXI.Sprite(rocketTexture);
        this.ship.anchor.set(0.5);
        this.ship.scale.set(Config.PLAYER_SCALE);
        this.ship.rotation = Config.PLAYER_INITIAL_ROTATION - Config.PLAYER_ROTATION_OFFSET;

        this.nameTag = new PIXI.Text(this.name, {
            fontFamily: 'Arial', 
            fontSize: Config.PLAYER_NAME_FONT_SIZE, 
            fill: Config.PLAYER_NAME_COLOR
        });
        this.nameTag.anchor.set(0.5);
        game.stage.addChild(this.nameTag);
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
        this.ship.x = x;
        this.ship.y = y;
        this.nameTag.x = x;
        this.nameTag.y = y + Config.PLAYER_NAME_OFFSET;
    }

    moveBy(x, y) {
        this.x += x;
        this.y += y;
        this.ship.x += x;
        this.ship.y += y;
        this.nameTag.x += x;
        this.nameTag.y += y;
    }

    moveTowardsDestination() {
        const dx = this.destinationPoint.x - this.x;
        const dy = this.destinationPoint.y - this.y;
        const angle = Math.atan2(dy, dx);
        const x = Config.PLAYER_SPEED * Math.cos(angle) * game.ticker.deltaTime;
        const y = Config.PLAYER_SPEED * Math.sin(angle) * game.ticker.deltaTime;
        this.ship.rotation = angle + Config.PLAYER_ROTATION_OFFSET;
        this.moveBy(x, y);
    }

    startMovingToPoint(point) {
        this.destinationPoint = point;
        this.showMovementTarget();
        this.redrawMovementTargetLine();
    }

    clampCoords() {
        if (this.x < 0) {
            this.x = 0;
            this.ship.x = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.ship.y = 0;
        }
        if (this.x > Config.MAP_SIZE) {
            this.x = Config.MAP_SIZE;
            this.ship.x = Config.MAP_SIZE;
        }
        if (this.y > Config.MAP_SIZE) {
            this.y = Config.MAP_SIZE;
            this.ship.y = Config.MAP_SIZE;
        }
    }

    showMovementTarget() {
        this.movementTarget.visible = true;
        this.movementTarget.x = this.destinationPoint.x;
        this.movementTarget.y = this.destinationPoint.y;
    }
    
    redrawMovementTargetLine() {
        this.movementTargetLine.clear();
        this.movementTargetLine.lineStyle(3, Config.TARGET_COLOR);
        this.movementTargetLine.moveTo(this.x, this.y);
        this.movementTargetLine.lineTo(this.destinationPoint.x, this.destinationPoint.y);
        this.movementTargetLine.alpha = Config.MOVEMENT_TARGET_LINE_ALPHA;
    }
        
    isDestinationReached() {
        return this.x > this.destinationPoint.x - Config.PLAYER_MOVE_STOP_DISTANCE && 
            this.x < this.destinationPoint.x + Config.PLAYER_MOVE_STOP_DISTANCE && 
            this.y > this.destinationPoint.y - Config.PLAYER_MOVE_STOP_DISTANCE &&
            this.y < this.destinationPoint.y + Config.PLAYER_MOVE_STOP_DISTANCE;
    }
}