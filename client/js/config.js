// Application configuration
const Config = {
    // Server configuration
    SERVER_PORT: 8001,

    // Game configuration
    MAP_SIZE: 4096,
    PLAYER_START_X: 2048,
    PLAYER_START_Y: 2048,
    PLAYER_SCALE: 0.125,
    PLAYER_INITIAL_ROTATION: 0,
    PLAYER_SPEED: 5.0,
    PLAYER_ROTATION_SPEED: 0.025,
    PLAYER_ROTATION_OFFSET: Math.PI * 0.25,
    PLAYER_MOVE_STOP_DISTANCE: 2,

    // Graphics configuration
    STAR_COUNT: 400,
    STAR_MAX_SCALE: 0.25,
    STAR_MIN_SCALE: 0.05,
    STAR_MIN_ALPHA: 0.35,
    STAR_MAX_ALPHA: 1,
    MOVEMENT_TARGET_SCALE: 0.6,
    MOVEMENT_TARGET_ALPHA: 0.85,
    MOVEMENT_TARGET_LINE_ALPHA: 0.25
}


// Server messages definitions
const ServerMessages = {
    INIT: "init"
}