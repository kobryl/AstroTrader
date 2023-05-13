// Application configuration
const Config = {
    // Server configuration
    SERVER_PORT: 8801,

    // Game configuration
    MAP_SIZE: 4096,
    PLAYER_START_X: 2048,
    PLAYER_START_Y: 2048,
    PLAYER_INITIAL_ROTATION: 0,
    PLAYER_SPEED: 5.0,
    PLAYER_ROTATION_SPEED: 0.025,
    PLAYER_ROTATION_OFFSET: Math.PI * 0.25,
    PLAYER_MOVE_STOP_DISTANCE: 2,
    OBJECT_INTERACTION_DISTANCE: 240,

    // Graphics configuration
    BACKGROUND_COLOR: 0x272b37,
    BORDER_COLOR: 0x21242e,
    TARGET_COLOR: 0xeeeeee,
    PLAYER_NAME_COLOR: 0xeeeeee,
    COMPASS_LABEL_COLOR: 0xeeeeee,
    STAR_COUNT: 400,
    STAR_MAX_SCALE: 0.25,
    STAR_MIN_SCALE: 0.05,
    STAR_MIN_ALPHA: 0.35,
    STAR_MAX_ALPHA: 1,
    PLAYER_SCALE: 0.125,
    ASTEROID_SCALE: 0.125,
    STATION_SCALE: 0.125,
    MOVEMENT_TARGET_SCALE: 0.6,
    MOVEMENT_TARGET_ALPHA: 0.6,
    MOVEMENT_TARGET_LINE_ALPHA: 0.25,
    OBJECT_TARGET_SCALE: 0.7,
    OBJECT_TARGET_ALPHA: 0.6,
    PLAYER_NAME_OFFSET: 60,
    PLAYER_NAME_FONT_SIZE: 18,
    COMPASS_SCALE_MULT: 0.25,
    COMPASS_ICON_OFFSET: -8,
    COMPASS_LABEL_FONT_SIZE: 14,
    COMPASS_LABEL_OFFSET: 17,
    COMPASS_ARROW_SCALE: 0.35,
    COMPASS_ARROW_OFFSET: 35,
    COMPASS_ARROW_ROTATION_OFFSET: Math.PI * 0.5,
    COMPASS_FADE_DISTANCE: 640,
    COMPASS_COMPLETE_FADE_DISTANCE: 320,
    COMPASS_RADIUS: 128
}


// Server messages definitions
const ServerMessages = {
    INIT_TYPE: "init"
}


// Game graphics
const starTexture = PIXI.Texture.from("assets/star.png");
const asteroidTexture = PIXI.Texture.from("assets/asteroid.png");
const stationTexture = PIXI.Texture.from("assets/station.png");
const rocketTexture = PIXI.Texture.from("assets/rocket.png");
const movementTargetTexture = PIXI.Texture.from("assets/movement_target.png");
const objectTargetTexture = PIXI.Texture.from("assets/object_target.png");
const arrowTexture = PIXI.Texture.from("assets/arrow.png");