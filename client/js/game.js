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

game.stage.pivot.x = config.player_start_x;
game.stage.pivot.y = config.player_start_y;
game.stage.position.x = window.innerWidth / 2;
game.stage.position.y = window.innerHeight / 2;

drawInitialScene();


function startGame() {
    player = new PIXI.Sprite(rocketTexture);
    player.anchor.set(0.5);
    player.x = config.player_start_x;
    player.y = config.player_start_y;
    player.scale.set(config.player_scale);
    player.rotation = config.player_initial_rotation - config.player_rotation_offset;
    game.stage.addChild(player);

    game.stage.eventMode = "static";
    game.stage.hitArea = new PIXI.Rectangle(0, 0, config.map_size, config.map_size);
    game.stage.addEventListener("click", onClick);
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    game.ticker.add(gameLoop);
}

function gameLoop() {
    // if (keys[87]) {      // W
    //     player.x += config.player_speed * Math.cos(player.rotation - config.player_rotation_offset);
    //     player.y += config.player_speed * Math.sin(player.rotation - config.player_rotation_offset);
    // }
    // if (keys[83]) {      // S
    //     player.x -= config.player_speed * Math.cos(player.rotation - config.player_rotation_offset);
    //     player.y -= config.player_speed * Math.sin(player.rotation - config.player_rotation_offset);
    // }
    // if (keys[65]) {      // A
    //     player.rotation -= config.player_rotation_speed;
    // }
    // if (keys[68]) {      // D
    //     player.rotation += config.player_rotation_speed;
    // }

    if (movingTowards) { 
        const dx = movingTowards.x - player.x;
        const dy = movingTowards.y - player.y;
        const angle = Math.atan2(dy, dx);
        player.x += config.player_speed * Math.cos(angle);
        player.y += config.player_speed * Math.sin(angle);
        player.rotation = angle + config.player_rotation_offset;

        if (player.x > movingTowards.x - config.player_move_stop_distance && 
            player.x < movingTowards.x + config.player_move_stop_distance && 
            player.y > movingTowards.y - config.player_move_stop_distance &&
            player.y < movingTowards.y + config.player_move_stop_distance) {
            movingTowards = null;
        }
    }

    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x > config.map_size) player.x = config.map_size;
    if (player.y > config.map_size) player.y = config.map_size;

    game.stage.pivot.x = player.x;
    game.stage.pivot.y = player.y;
}

function onClick(e) {
    if (e.global.x < 0 || e.global.x > config.map_size || e.global.y < 0 || e.global.y > config.map_size) return;
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
    for (let i = 0; i < config.star_count; i++) {
        const star = new PIXI.Sprite(starTexture);
        star.x = Math.random() * config.map_size;
        star.y = Math.random() * config.map_size;
        star.anchor.set(0.5);
        star.alpha = config.star_min_alpha + Math.random() * (config.star_max_alpha - config.star_min_alpha);
        star.scale.set(config.star_min_scale + Math.random() * (config.star_max_scale - config.star_min_scale));
        game.stage.addChild(star);
    }
    
    // Borders
    const borderLeft = new PIXI.Graphics();
    borderLeft.lineStyle(3, 0x000000).moveTo(0, 0).lineTo(0, config.map_size);
    game.stage.addChild(borderLeft);
    
    const borderRight = new PIXI.Graphics();
    borderRight.lineStyle(3, 0x000000).moveTo(0, 0).lineTo(0, config.map_size);
    borderRight.x = config.map_size;
    game.stage.addChild(borderRight);
    
    const borderTop = new PIXI.Graphics();
    borderTop.lineStyle(3, 0x000000).moveTo(0, 0).lineTo(config.map_size, 0);
    game.stage.addChild(borderTop);
    
    const borderBottom = new PIXI.Graphics();
    borderBottom.lineStyle(3, 0x000000).moveTo(0, 0).lineTo(config.map_size, 0);
    borderBottom.y = config.map_size;
    game.stage.addChild(borderBottom);
}