const game = new PIXI.Application({ 
    autoResize: true,
    resolution: devicePixelRatio,
    backgroundColor: Config.BACKGROUND_COLOR,
});
game.view.id = "game-canvas";

let clientPlayer;
let playerCompass;
let otherPlayers = [];
let keys = [];              // redundant, leftovers from keyboard-based movement
let stations = [];
let asteroids = [];

init();


// Main functions

function init() {
    game.stage.pivot.x = Config.PLAYER_START_X;
    game.stage.pivot.y = Config.PLAYER_START_Y;
    game.stage.position.x = window.innerWidth / 2;
    game.stage.position.y = window.innerHeight / 2;
    game.stage.eventMode = "static";
    game.stage.hitArea = new PIXI.Rectangle(0, 0, Config.MAP_SIZE, Config.MAP_SIZE);
    drawInitialScene();
}

function initPlayers() {
    clientPlayer = new Player(getPlayerName(), Config.PLAYER_START_X, Config.PLAYER_START_Y);
    addPlayerObjectsToStage(clientPlayer);
    // todo: others from server data
}

function initObjects() {        // initObjects(data) { ... }
    // temporary, for testing
    asteroids.push(new Asteroid(2300, 2300));
    asteroids.push(new Asteroid(2800, 1600));
    asteroids.forEach(asteroid => {
        playerCompass.addObject(asteroid);
    });

    stations.push(new Station(1500, 2000));
    stations.push(new Station(3000, 3000));
    stations.forEach(station => {
        playerCompass.addObject(station);
    });
}

function startGame() {
    playerCompass = new PlayerCompass(Config.PLAYER_START_X, Config.PLAYER_START_Y);
    initObjects();              // from someServerData as parameter
    initPlayers();              // from someServerData as parameter
    game.ticker.add(gameLoop);
    game.stage.addEventListener("click", onClick);
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    setHudVisibility(true);
}

function gameLoop() {
    movePlayers();
    updatePlayerCoordsHud(clientPlayer.x, clientPlayer.y);
    playerCompass.setPos(clientPlayer.x, clientPlayer.y);
    playerCompass.update(clientPlayer.x, clientPlayer.y);
    game.stage.pivot.x = clientPlayer.x;
    game.stage.pivot.y = clientPlayer.y;
}

function movePlayers() {
    let movingPlayers = otherPlayers.concat(clientPlayer);
    movingPlayers.forEach(player => {
        if (player.destinationPoint) { 
            player.moveTowardsDestination();
            player.clampCoords();
            player.redrawMovementTargetLine();
            if (player.isDestinationReached()) {
                player.destinationPoint = null;
                player.movementTarget.visible = false;
            }
        }
    });
}


// Event handlers

function onClick(e) {
    if (e.global.x < 0 || e.global.x > Config.MAP_SIZE || e.global.y < 0 || e.global.y > Config.map_size) return;
    clientPlayer.destinationPoint = game.stage.toLocal(e.global);
    clientPlayer.showMovementTarget();
    // todo: send to server
}

// redundant, leftover from keyboard-based movement
function keyDown(e) {
    keys[e.keyCode] = true;
}

// redundant, leftover from keyboard-based movement
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
    borderLeft.lineStyle(3, Config.BORDER_COLOR).moveTo(0, 0).lineTo(0, Config.MAP_SIZE);
    game.stage.addChild(borderLeft);
    
    const borderRight = new PIXI.Graphics();
    borderRight.lineStyle(3, Config.BORDER_COLOR).moveTo(0, 0).lineTo(0, Config.MAP_SIZE);
    borderRight.x = Config.MAP_SIZE;
    game.stage.addChild(borderRight);
    
    const borderTop = new PIXI.Graphics();
    borderTop.lineStyle(3, Config.BORDER_COLOR).moveTo(0, 0).lineTo(Config.MAP_SIZE, 0);
    game.stage.addChild(borderTop);
    
    const borderBottom = new PIXI.Graphics();
    borderBottom.lineStyle(3, Config.BORDER_COLOR).moveTo(0, 0).lineTo(Config.MAP_SIZE, 0);
    borderBottom.y = Config.MAP_SIZE;
    game.stage.addChild(borderBottom);
}


// Utility functions

function centerOnPlayer() {
    if (!clientPlayer) return;
    game.stage.pivot.x = clientPlayer.x;
    game.stage.pivot.y = clientPlayer.y;
    game.stage.position.x = window.innerWidth / 2;
    game.stage.position.y = window.innerHeight / 2;
}

function addPlayerObjectsToStage(player) {
    game.stage.addChild(player.movementTarget);
    game.stage.addChild(player.movementTargetLine);
    game.stage.addChild(player.ship);
    game.stage.addChild(player.nameTag);
}

function moveToObject(object) {
    let dest = new PIXI.Point(object.x, object.y);
    const dx = dest.x - clientPlayer.x;
    const dy = dest.y - clientPlayer.y;
    const angle = Math.atan2(dy, dx);
    dest.x -= Math.cos(angle) * Config.OBJECT_INTERACTION_DISTANCE;
    dest.y -= Math.sin(angle) * Config.OBJECT_INTERACTION_DISTANCE;
    clientPlayer.destinationPoint = dest;
    clientPlayer.showMovementTarget();
    // clientPlayer.showMovementTarget();
}