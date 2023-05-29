let isPlayerItemListOpen = false;

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

function onCheckClick() {
    playerItems.forEach(item => {
        sendPriceCheck(item.id);
    });
}

function onSellClick(item) {
    sendSell(item.id, item.askingPrice);
}

function onPlayerItemsButtonClick() {
    if (isPlayerItemListOpen) {
        document.querySelector("#item-list").style.display = "none";
        isPlayerItemListOpen = false;
    }
    else {
        document.querySelector("#item-list").style.display = "block";
        isPlayerItemListOpen = true;
    }
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

function updatePlayerMoneyHud(amount) {
    document.querySelector("#player-money-value").innerHTML = Math.round(amount * 100) / 100;
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
        const playerName = document.createElement("div");
        playerName.classList.add("player-list-element-name");
        playerName.innerHTML = player.name;
        playerElement.appendChild(playerName);
        const playerMoney = document.createElement("div");
        playerMoney.classList.add("player-list-element-money");
        playerMoney.innerHTML = Math.round(player.money * 100) / 100 + " $";
        playerElement.appendChild(playerMoney);
        list.appendChild(playerElement);
    }
}

function updatePlayerItemList() {
    const list = document.querySelector("#item-list-content");
    list.innerHTML = "";
    playerItems.forEach(item => {
        list.appendChild(item.createPlayerListElement());
    });
    document.querySelector("#item-count").innerHTML = playerItems.length;
}

function populateStationItemList() {
    const list = document.querySelector("#station-item-list-content");
    list.innerHTML = "";
    playerItems.forEach(item => {
        list.appendChild(item.createStationListElement(0, 0));
        sendPriceCheck(item.id);
    });
}

function updateStationItemPrice(id, price, modifier) {
    const list = document.querySelector("#station-item-list-content");
    const itemElement = list.querySelector(".item-" + id);
    if (!itemElement) return;
    itemElement.querySelector(".item-value").innerHTML = (Math.round(price * 100) / 100) + " $";
    const itemModifier = itemElement.querySelector(".item-modifier");
    if (modifier > 1) {
        itemModifier.classList.add("item-modifier-positive");
        itemModifier.classList.remove("item-modifier-negative");
        itemModifier.innerHTML = "+";
    }
    else {
        itemModifier.classList.add("item-modifier-negative");
        itemModifier.classList.remove("item-modifier-positive");
        itemModifier.innerHTML = "";
    }
    itemModifier.innerHTML += Math.round((modifier - 1) * 10000) / 100 + "%";
    playerItems.forEach(item => {
        if (item.id == id) {
            item.askingPrice = price;
        }
    });
}