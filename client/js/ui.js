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
    // todo: implement
    console.log("Mining asteroid " + id);
}

function onCheckClick(items) {
    // todo: implement
    console.log("Checking items " + items);
}


// UI drawing functions

function closeActiveMenu() {
    document.querySelector("#active-menu").style.display = 'none';
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