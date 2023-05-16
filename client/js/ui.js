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

function onMineClick(id) {
    sendMine(id);
    currentlyMinedAsteroid = id;
    document.querySelector(".asteroid-stop-disclaimer").style.display = 'initial';
    document.querySelector(".asteroid-actions .mine-button").onclick = () => { null };
    document.querySelector(".asteroid-actions .mine-button").style.cursor = "initial";
    document.querySelector(".asteroid-actions .mine-button").style.color = "gray";
    document.querySelector(".asteroid-actions .mine-button").style.backgroundColor = "#343740";
}

function onCheckClick(items) {
    // todo: implement
    console.log("Checking items " + items);
}


// UI drawing functions

function closeActiveMenu() {
    document.querySelector("#active-menu").style.display = 'none';
    document.querySelector(".asteroid-stop-disclaimer").style.display = 'none';
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

function updatePlayerCoordsHud(x, y) {
    document.querySelector("#player-coords-x .coords-value").innerHTML = Math.round(x);
    document.querySelector("#player-coords-y .coords-value").innerHTML = Math.round(y);
}

function updateAsteroidProgress(progress) {
    let asteroidId = document.querySelector("#active-menu .object-id").innerHTML;
    if (asteroidId != currentlyMinedAsteroid) progress = 0;
    document.querySelector(".asteroid-progress-bar-label").innerHTML = Math.round(progress * 100) + "%";
    document.querySelector(".asteroid-progress-bar-fill").style.width = (progress * 100) + "%";
}

function updatePlayerList() {
    const list = document.querySelector("#player-list-content");
    list.innerHTML = "";
    for (let id in players) {
        const player = players[id];
        const playerElement = document.createElement("div");
        playerElement.classList.add("player-list-element");
        if (player.id == assignedClientId) playerElement.classList.add("player-list-element-self");
        playerElement.innerHTML = player.name;
        list.appendChild(playerElement);
    }
}