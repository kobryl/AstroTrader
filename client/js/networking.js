let socket = null;
let waitingForFirstUpdate = false;
let waitingForConfirmation = true;
let assignedClientId = null;


// Message handling functions

function createMessage(type, content) {
    return JSON.stringify({ type: type, content: content });
}

function handleMessage(message) {
    data = JSON.parse(message);
    // console.log("Received message (" + data.type + "): ");
    // console.log(data.content);

    switch (data.type) {
        case ServerMessages.UPDATE:
            if (waitingForConfirmation) break;
            handleUpdate(data.content);
            if (waitingForFirstUpdate) {
                waitingForFirstUpdate = false;
                startGame(assignedClientId);
                setHudVisibility(true);
                fadeOutLanding();
                console.log("Got first update, starting game");
            }
            break;
        case ServerMessages.CONFIRM_CONNECTION:
            const status = data.content.status;
            if (status === "ok") {
                waitingForFirstUpdate = true;
                waitingForConfirmation = false;
                assignedClientId = data.content.id;
                console.log("Client id: " + assignedClientId);
                setTimeout(() => { sendEmptyMessage(); }, 500);
            }
            break;
        case ServerMessages.MINING_STATUS:
            const progress = data.content.progress;
            updateAsteroidProgress(progress);
            break;
        case ServerMessages.CHECK_PRICE_RESPONSE:
            const id = data.content.id;
            const price = data.content.price;
            const modifier = data.content.modifier;
            updateStationItemPrice(id, price, modifier);
            break;
        case ServerMessages.ITEM_ACTION:
            const action = data.content.action;
            const itemId = data.content.id;
            if (action === "add") {
                const name = data.content.name;
                const value = data.content.value;
                addItem(itemId, name, value);
            }
            else if (action === "remove") {
                removeItem(itemId);
            }
            break;
        case ServerMessages.MONEY_ACTION:
            const moneyAction = data.content.action;
            const moneyAmount = data.content.amount;
            if (moneyAction === "add") {
                addMoney(moneyAmount);
            }
            else if (moneyAction === "remove") {
                removeMoney(moneyAmount);
            }
            break;
        case ServerMessages.SELL_ACTION:
            const sellStatus = data.content.status;
            if (sellStatus === "outdated") {
                const actualPrice = data.content.actual_price;
                alert("The price of the sold item has changed. It was sold for " + Math.round(actualPrice * 100) / 100 + " $.");
                playerItems.forEach(item => {
                    sendPriceCheck(item.id);
                });
            }
    }
}


// Connection functions

function connect(address, username) {
    socket = new WebSocket(address);

    socket.addEventListener("open", () => {
        content = { player: { name: username } };
        const initMsg = createMessage(ServerMessages.JOIN, content);
        socket.send(initMsg);
    });
    
    socket.addEventListener("message", (event) => {
        handleMessage(event.data);
    });
}


// Message sending functions

function sendMoveToDestination(dest) {
    const content = { player: { destination: [dest.x, dest.y] } };
    const msg = createMessage(ServerMessages.MOVE, content);
    console.log("Sending move message: " + msg);
    socket.send(msg);
}

function sendMine(id) {
    const content = { asteroid: id };
    const msg = createMessage(ServerMessages.MINE, content);
    console.log("Sending mine message: " + msg);
    socket.send(msg);
}

function sendPriceCheck(id) {
    const content = { item: id };
    const msg = createMessage(ServerMessages.CHECK_PRICE, content);
    console.log("Sending price check message: " + msg);
    socket.send(msg);
}

function sendEmptyMessage() {
    socket.send("");
}

function sendSell(id, askingPrice) {
    const content = { item: id, price: askingPrice };
    const msg = createMessage(ServerMessages.SELL_ACTION, content);
    console.log("Sending sell message: " + msg);
    socket.send(msg);
}


// Message receiving functions

function handleUpdate(content) { 
    // todo: handle disconnects
    const players = content.players;
    for (const [id, playerData] of Object.entries(players)) {
        // console.log("Updating player: " + id + " with data: ");
        // console.log(playerData);
        updatePlayer(id, playerData);
    }

    const asteroids = content.asteroids;
    for (const [id, asteroidData] of Object.entries(asteroids)) {
        // console.log("Updating asteroid: " + id + " with data: ");
        // console.log(asteroidData);
        updateAsteroid(id, asteroidData);
    }

    // const stations = content.stations;                  (multiple stations implementation)
    const stations = new Array(content.station);        // (single station implementation)
    for (const [id, stationData] of Object.entries(stations)) {
        // console.log("Updating station: " + id + " with data: ");
        // console.log(stationData);
        updateStation(id, stationData);
    }

    updatePlayerList();
}