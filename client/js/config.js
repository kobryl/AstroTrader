// Application configuration
const Config = {
    // Server configuration
    SERVER_PORT: 8001,

    // Game configuration
    MAP_SIZE: 3072,
    PLAYER_START_X: 1536,
    PLAYER_START_Y: 1536,
    PLAYER_INITIAL_ROTATION: 0,
    PLAYER_SPEED: 250,
    PLAYER_ROTATION_SPEED: 0.025,
    PLAYER_ROTATION_OFFSET: Math.PI * 0.25,
    PLAYER_MOVE_STOP_DISTANCE: 4,
    OBJECT_INTERACTION_DISTANCE: 240,
    OBJECT_INTERACTION_DISTANCE_TOLERANCE: 5,
    RICHNESS_MIN: 0,
    RICHNESS_MAX: 1,

    // Graphics configuration
    BACKGROUND_COLOR: 0x272b37,
    BORDER_COLOR: 0x21242e,
    TARGET_COLOR: 0xeeeeee,
    PLAYER_NAME_COLOR: 0xeeeeee,
    COMPASS_LABEL_COLOR: 0xeeeeee,
    STAR_COUNT: 300,
    STAR_MAX_SCALE: 0.175,
    STAR_MIN_SCALE: 0.0375,
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
    COMPASS_FADE_DISTANCE: Math.min(screen.width, screen.height) / 2.5,
    COMPASS_COMPLETE_FADE_DISTANCE: Math.min(screen.width, screen.height) / 5,
    COMPASS_RADIUS: 128
}


// Server messages definitions
const ServerMessages = {
    JOIN: "join",
    MOVE: "move",
    UPDATE: "update",
    CONFIRM_CONNECTION: "connection",
    MINE: "mine",
    MINING_STATUS: "mine_update",
    CHECK_PRICE: "check",
    CHECK_PRICE_RESPONSE: "check_response",
    ITEM_ACTION: "item",
    MONEY_ACTION: "money",
    SELL_ACTION: "sell"
}


// Game graphics
const starTexture = PIXI.Texture.from("assets/star.png");
const asteroidTexture = PIXI.Texture.from("assets/asteroid.png");
const stationTexture = PIXI.Texture.from("assets/station.png");
const rocketTexture = PIXI.Texture.from("assets/rocket.png");
const movementTargetTexture = PIXI.Texture.from("assets/movement_target.png");
const objectTargetTexture = PIXI.Texture.from("assets/object_target.png");
const arrowTexture = PIXI.Texture.from("assets/arrow.png");

const mineralColors = new Map([
    ["Iron", "#758085"],
    ["Copper", "#B78D62"],
    ["Silver", "#A0A0A0"],
    ["Gold", "#E6C84D"],
    ["Platinum", "#D9D8D4"],
    ["Diamond", "#B4EAF7"],
    ["Emerald", "#6BBF83"],
    ["Ruby", "#E32F77"],
    ["Sapphire", "#1D5BB6"],
    ["Titanium", "#909090"],
    ["Uranium", "#57E93E"],
    ["Plutonium", "#E53935"],
    ["Tungsten", "#4D4D4D"],
    ["Tin", "#BDBDBD"],
    ["Lead", "#787878"],
    ["Zinc", "#C9CBCD"],
    ["Nickel", "#9B9B9B"],
    ["Cobalt", "#0047AB"],
    ["Chromium", "#878787"],
    ["Bismuth", "#979797"]
]);