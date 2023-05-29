const game = new PIXI.Application({ 
    autoResize: true,
    resolution: devicePixelRatio,
    backgroundColor: Config.BACKGROUND_COLOR,
});
game.view.id = "game-canvas";

let clientPlayer;
let playerCompass;
let players = [];
let stations = [];
let asteroids = [];
let playerItems = [];
let messageCounter = 0;
let currentlyMinedAsteroid = null;


// Initialization functions

function initGame() {
    game.stage.pivot.x = Config.PLAYER_START_X;
    game.stage.pivot.y = Config.PLAYER_START_Y;
    game.stage.position.x = window.innerWidth / (2 * devicePixelRatio);
    game.stage.position.y = window.innerHeight / (2 * devicePixelRatio);
    game.stage.eventMode = "static";
    game.stage.hitArea = new PIXI.Rectangle(0, 0, Config.MAP_SIZE, Config.MAP_SIZE);
    drawInitialScene();
    playerCompass = new PlayerCompass(Config.PLAYER_START_X, Config.PLAYER_START_Y);
}

function initClientPlayer(clientId) {
    clientPlayer = players.find(player => player.id == clientId);
}


// Main functions

function startGame(clientId) {
    initClientPlayer(clientId);
    game.ticker.add(gameLoop);
    game.stage.addEventListener("click", onClick);
    setHudVisibility(true);
}

function gameLoop() {
    movePlayers();
    updatePlayerCoordsHud(clientPlayer.x, clientPlayer.y);
    playerCompass.setPos(clientPlayer.x, clientPlayer.y);
    playerCompass.update(clientPlayer.x, clientPlayer.y);
    game.stage.pivot.x = clientPlayer.x;
    game.stage.pivot.y = clientPlayer.y;
    messageCounter += game.ticker.deltaMS;
    if (messageCounter >= 500) {
        sendEmptyMessage();
        messageCounter = 0;
    }
}

function movePlayers() {
    players.forEach(player => {
        if (player.destinationPoint) { 
            player.moveTowardsDestination(game.ticker.deltaMS / 1000);
            player.clampCoords();
            player.redrawMovementTargetLine();
            if (player.isDestinationReached()) {
                player.destinationPoint = null;
                player.movementTarget.visible = false;
                if (player === clientPlayer && player.interactionObject) {
                    player.interactionObject.openMenu();
                }
                player.interactionObject = null;
            }
        }
    });
}

function updatePlayer(id, data) {
    let player = players.find(player => player.id == id);
    if (player) {
        player.update(data);
    } else {
        console.log("Creating a new player: " + id + " with data:");
        console.log(data);
        player = new Player(id, data.name, data.position[0], data.position[1]);
        players.push(player);
        addPlayerObjectsToStage(player);
    }
}

function updateAsteroid(id, data) {
    let asteroid = asteroids.find(asteroid => asteroid.id == id);
    if (asteroid) {
        asteroid.update(data);
    } else {
        console.log("Creating a new asteroid: " + id + " with data:");
        console.log(data);
        asteroid = new Asteroid(data.name, id, data.position[0], data.position[1], data.resoruces_left, data.richness);
        asteroids.push(asteroid);
        playerCompass.addObject(asteroid);
    }
}

function updateStation(id, data) {
    let station = stations.find(station => station.id == id);
    if (station) {
        station.update(data);
    } else {
        console.log("Creating a new station: " + id + " with data:");
        console.log(data);
        station = new Station(data.name, id, data.position[0], data.position[1], data.resources_left, data.richness);
        stations.push(station);
        playerCompass.addObject(station);
    }
}


// Player inventory/money functions


function addItem(id, name, value) {
    playerItems.push(new Item(id, name, value));
    updatePlayerItemList();
}

function removeItem(id) {
    playerItems = playerItems.filter(item => item.id != id);
    updatePlayerItemList();
    populateStationItemList();
}

function addMoney(amount) {
    clientPlayer.money += amount;
    updatePlayerMoneyHud(clientPlayer.money);
}

function removeMoney(amount) {
    clientPlayer.money -= amount;
    updatePlayerMoneyHud(clientPlayer.money);
}


// Event handlers

function onClick(e) {
    if (e.global.x < 0 || e.global.x > Config.MAP_SIZE || e.global.y < 0 || e.global.y > Config.map_size) return;
    clientPlayer.startMovingToPoint(game.stage.toLocal(e.global));
    clientPlayer.interactionObject = null;
    sendMoveToDestination(clientPlayer.destinationPoint);
    closeActiveMenu();
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
    game.stage.position.x = window.innerWidth / (2 * devicePixelRatio);
    game.stage.position.y = window.innerHeight / (2 * devicePixelRatio);
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
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist >= Config.OBJECT_INTERACTION_DISTANCE) {
        const angle = Math.atan2(dy, dx);
        dest.x -= Math.cos(angle) * Config.OBJECT_INTERACTION_DISTANCE;
        dest.y -= Math.sin(angle) * Config.OBJECT_INTERACTION_DISTANCE;
        clientPlayer.startMovingToPoint(dest);
        clientPlayer.interactionObject = object;
        sendMoveToDestination(clientPlayer.destinationPoint);
        closeActiveMenu();
    }
    if (dist <= Config.OBJECT_INTERACTION_DISTANCE + Config.OBJECT_INTERACTION_DISTANCE_TOLERANCE) {
        object.openMenu();
    }
}