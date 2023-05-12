const bgColor = 0x272b37;
const borderColor = 0x21242e;
const targetColor = 0xeeeeee;

const game = new PIXI.Application({ 
    autoResize: true,
    resolution: devicePixelRatio,
    backgroundColor: bgColor,
});
game.view.id = "game-canvas";

const starTexture = PIXI.Texture.from("assets/star.png");
const asteroidTexture = PIXI.Texture.from("assets/asteroid.png");
const rocketTexture = PIXI.Texture.from("assets/rocket.png");
const movementTargetTexture = PIXI.Texture.from("assets/movement_target.png");
const dashTexture = PIXI.Texture.from("assets/dash_tile.png");

let player;
let movementTarget;
let movementTargetLine;
let movingTowards = null;
let keys = {};

initialize();


// Main functions

function initialize() {
    game.stage.pivot.x = Config.PLAYER_START_X;
    game.stage.pivot.y = Config.PLAYER_START_Y;
    game.stage.position.x = window.innerWidth / 2;
    game.stage.position.y = window.innerHeight / 2;
    
    drawInitialScene();
}

function initializeObjects() {
    movementTarget = new PIXI.Sprite(movementTargetTexture);
    movementTarget.anchor.set(0.5);
    movementTarget.x = 0;
    movementTarget.y = 0;
    movementTarget.scale.set(Config.MOVEMENT_TARGET_SCALE);
    movementTarget.alpha = Config.MOVEMENT_TARGET_ALPHA;
    movementTarget.visible = false;
    game.stage.addChild(movementTarget);

    movementTargetLine = new PIXI.Graphics();
    game.stage.addChild(movementTargetLine);

    player = new PIXI.Sprite(rocketTexture);
    player.anchor.set(0.5);
    player.x = Config.PLAYER_START_X;
    player.y = Config.PLAYER_START_Y;
    player.scale.set(Config.PLAYER_SCALE);
    player.rotation = Config.PLAYER_INITIAL_ROTATION - Config.PLAYER_ROTATION_OFFSET;
    game.stage.addChild(player);
}

function startGame() {
    initializeObjects();
    game.stage.eventMode = "static";
    game.stage.hitArea = new PIXI.Rectangle(0, 0, Config.MAP_SIZE, Config.MAP_SIZE);
    game.ticker.add(gameLoop);
    game.stage.addEventListener("click", onClick);
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
}

function gameLoop() {
    if (movingTowards) { 
        const dx = movingTowards.x - player.x;
        const dy = movingTowards.y - player.y;
        const angle = Math.atan2(dy, dx);
        player.x += Config.PLAYER_SPEED * Math.cos(angle);
        player.y += Config.PLAYER_SPEED * Math.sin(angle);
        player.rotation = angle + Config.PLAYER_ROTATION_OFFSET;
        redrawMovementTargetLine();

        if (player.x > movingTowards.x - Config.PLAYER_MOVE_STOP_DISTANCE && 
            player.x < movingTowards.x + Config.PLAYER_MOVE_STOP_DISTANCE && 
            player.y > movingTowards.y - Config.PLAYER_MOVE_STOP_DISTANCE &&
            player.y < movingTowards.y + Config.PLAYER_MOVE_STOP_DISTANCE) {
            movingTowards = null;
            movementTarget.visible = false;
        }
    }

    clampPlayerCoords();
    updatePlayerCoordsHud(player.x, player.y);
    game.stage.pivot.x = player.x;
    game.stage.pivot.y = player.y;
}


// Event handlers

function onClick(e) {
    if (e.global.x < 0 || e.global.x > Config.MAP_SIZE || e.global.y < 0 || e.global.y > Config.map_size) return;
    movingTowards = game.stage.toLocal(e.global);
    showMovementTarget();
}

function keyDown(e) {
    keys[e.keyCode] = true;
}

function keyUp(e) {
    keys[e.keyCode] = false;
}


// Drawing functions

function drawInitialScene() {
    drawStars();
    drawBorders();
}

function drawStars() {
    for (let i = 0; i < Config.STAR_COUNT; i++) {
        const star = new PIXI.Sprite(starTexture);
        star.x = Math.random() * Config.MAP_SIZE;
        star.y = Math.random() * Config.MAP_SIZE;
        star.anchor.set(0.5);
        star.alpha = Config.STAR_MIN_ALPHA + Math.random() * (Config.STAR_MAX_ALPHA - Config.STAR_MIN_ALPHA);
        star.scale.set(Config.STAR_MIN_SCALE + Math.random() * (Config.STAR_MAX_SCALE - Config.STAR_MIN_SCALE));
        game.stage.addChild(star);
    }
}

function drawBorders() {
    const borderLeft = new PIXI.Graphics();
    borderLeft.lineStyle(3, borderColor).moveTo(0, 0).lineTo(0, Config.MAP_SIZE);
    game.stage.addChild(borderLeft);
    
    const borderRight = new PIXI.Graphics();
    borderRight.lineStyle(3, borderColor).moveTo(0, 0).lineTo(0, Config.MAP_SIZE);
    borderRight.x = Config.MAP_SIZE;
    game.stage.addChild(borderRight);
    
    const borderTop = new PIXI.Graphics();
    borderTop.lineStyle(3, borderColor).moveTo(0, 0).lineTo(Config.MAP_SIZE, 0);
    game.stage.addChild(borderTop);
    
    const borderBottom = new PIXI.Graphics();
    borderBottom.lineStyle(3, borderColor).moveTo(0, 0).lineTo(Config.MAP_SIZE, 0);
    borderBottom.y = Config.MAP_SIZE;
    game.stage.addChild(borderBottom);
}

function showMovementTarget() {
    movementTarget.visible = true;
    movementTarget.x = movingTowards.x;
    movementTarget.y = movingTowards.y;
}

function redrawMovementTargetLine() {
    movementTargetLine.clear();
    movementTargetLine.lineStyle(3, targetColor);
    movementTargetLine.moveTo(player.x, player.y);
    movementTargetLine.lineTo(movingTowards.x, movingTowards.y);
    movementTargetLine.alpha = Config.MOVEMENT_TARGET_LINE_ALPHA;
}

// Utility functions

function centerOnPlayer() {
    if (!player) return;
    game.stage.pivot.x = player.x;
    game.stage.pivot.y = player.y;
    game.stage.position.x = window.innerWidth / 2;
    game.stage.position.y = window.innerHeight / 2;
}

function clampPlayerCoords() {
    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x > Config.MAP_SIZE) player.x = Config.MAP_SIZE;
    if (player.y > Config.MAP_SIZE) player.y = Config.MAP_SIZE;
}