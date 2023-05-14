// Getter functions for UI elements

function getPlayerName() {
    return document.querySelector("#username-input").value;
}

function getServerAddress() {
    return document.querySelector("#address-input").value;
}


// UI event handlers

function handleConnectClick() {
    let address = getServerAddress();
    const username = getPlayerName();

    if (address == "") {
        alert("Please enter a server address.");
        return;
    }
    if (username == "") {
        alert("Please enter a username.");
        return;
    }
    
    address = "ws://" + address + ":" + Config.SERVER_PORT;
    connect(address, username);
}

function onCloseActiveMenuClick() {
    closeActiveMenu();
}


// UI drawing functions

function openObjectMenu(object) {
    if (object instanceof Asteroid) {
        openAsteroidMenu(object);
    } else if (object instanceof Station) {
        openStationMenu(object);
    }
}

function closeActiveMenu() {
    document.querySelector("#active-menu").style.display = 'none';
}

function openAsteroidMenu(asteroid) {
    const menu = document.querySelector("#active-menu");
    menu.style.display = 'initial';
    menu.querySelector(".object-name").innerHTML = asteroid.name;
    menu.querySelector(".object-id").innerHTML = asteroid.id;
    menu.querySelector(".object-type").innerHTML = "Asteroid";
}

function openStationMenu(station) {
    const menu = document.querySelector("#active-menu");
    menu.style.display = 'initial';
    menu.querySelector(".object-name").innerHTML = station.name;
    menu.querySelector(".object-id").innerHTML = station.id;
    menu.querySelector(".object-type").innerHTML = "Station";
}

function fadeOutLanding() {
    const landingSection = document.querySelector('#landing-section');
    landingSection.style.opacity = 0;
    document.querySelector("#connect-menu .button").style.cursor = "initial";
    setTimeout(() => {
        landingSection.style.display = 'none';
    }, 1000);
}

function setHudVisibility(isVisible) {
    if (isVisible) {
        document.querySelector("#hud").style.display = 'initial';
    } else {
        document.querySelector("#hud").style.display = 'none';
    }
}

function updatePlayerCoordsHud(x, y, precision = 0) {
    document.querySelector("#player-coords-x .coords-value").innerHTML = Math.round(x, precision);
    document.querySelector("#player-coords-y .coords-value").innerHTML = Math.round(y, precision);
}