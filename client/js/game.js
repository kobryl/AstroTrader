const game = new PIXI.Application({ 
    autoResize: true,
    resolution: devicePixelRatio,
    backgroundColor: 0x272b37,
});
game.view.id = "game-canvas";

const starTexture = PIXI.Texture.from("assets/star.png");
const asteroidTexture = PIXI.Texture.from("assets/asteroid.png");
const rocketTexture = PIXI.Texture.from("assets/rocket.png");

let player;
let movingTowards = null;
let keys = {};

game.stage.pivot.x = Config.PLAYER_START_X;
game.stage.pivot.y = Config.PLAYER_START_Y;
game.stage.position.x = window.innerWidth / 2;
game.stage.position.y = window.innerHeight / 2;

drawInitialScene();


function startGame() {
    player = new PIXI.Sprite(rocketTexture);
    player.anchor.set(0.5);
    player.x = Config.PLAYER_START_X;
    player.y = Config.PLAYER_START_Y;
    player.scale.set(Config.PLAYER_SCALE);
    player.rotation = Config.PLAYER_INITIAL_ROTATION - Config.PLAYER_ROTATION_OFFSET;
    game.stage.addChild(player);

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

        if (player.x > movingTowards.x - Config.PLAYER_MOVE_STOP_DISTANCE && 
            player.x < movingTowards.x + Config.PLAYER_MOVE_STOP_DISTANCE && 
            player.y > movingTowards.y - Config.PLAYER_MOVE_STOP_DISTANCE &&
            player.y < movingTowards.y + Config.PLAYER_MOVE_STOP_DISTANCE) {
            movingTowards = null;
        }
    }

    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x > Config.MAP_SIZE) player.x = Config.MAP_SIZE;
    if (player.y > Config.MAP_SIZE) player.y = Config.MAP_SIZE;

    game.stage.pivot.x = player.x;
    game.stage.pivot.y = player.y;
}

function onClick(e) {
    if (e.global.x < 0 || e.global.x > Config.MAP_SIZE || e.global.y < 0 || e.global.y > Config.map_size) return;
    movingTowards = game.stage.toLocal(e.global);
    console.log("Moving towards", movingTowards);
}

function keyDown(e) {
    keys[e.keyCode] = true;
}

function keyUp(e) {
    keys[e.keyCode] = false;
}

function drawInitialScene() {
    // Background stars
    for (let i = 0; i < Config.STAR_COUNT; i++) {
        const star = new PIXI.Sprite(starTexture);
        star.x = Math.random() * Config.MAP_SIZE;
        star.y = Math.random() * Config.MAP_SIZE;
        star.anchor.set(0.5);
        star.alpha = Config.STAR_MIN_ALPHA + Math.random() * (Config.STAR_MAX_ALPHA - Config.STAR_MIN_ALPHA);
        star.scale.set(Config.STAR_MIN_SCALE + Math.random() * (Config.STAR_MAX_SCALE - Config.STAR_MIN_SCALE));
        game.stage.addChild(star);
    }
    
    // Borders
    const borderLeft = new PIXI.Graphics();
    borderLeft.lineStyle(3, 0x000000).moveTo(0, 0).lineTo(0, Config.MAP_SIZE);
    game.stage.addChild(borderLeft);
    
    const borderRight = new PIXI.Graphics();
    borderRight.lineStyle(3, 0x000000).moveTo(0, 0).lineTo(0, Config.MAP_SIZE);
    borderRight.x = Config.MAP_SIZE;
    game.stage.addChild(borderRight);
    
    const borderTop = new PIXI.Graphics();
    borderTop.lineStyle(3, 0x000000).moveTo(0, 0).lineTo(Config.MAP_SIZE, 0);
    game.stage.addChild(borderTop);
    
    const borderBottom = new PIXI.Graphics();
    borderBottom.lineStyle(3, 0x000000).moveTo(0, 0).lineTo(Config.MAP_SIZE, 0);
    borderBottom.y = Config.MAP_SIZE;
    game.stage.addChild(borderBottom);
}

function centerOnPlayer() {
    if (!player) return;
    game.stage.pivot.x = player.x;
    game.stage.pivot.y = player.y;
    game.stage.position.x = window.innerWidth / 2;
    game.stage.position.y = window.innerHeight / 2;
}