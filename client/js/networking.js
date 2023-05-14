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
    console.log("Received message (" + data.type + "): ");
    console.log(data.content);

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
            }
            break;
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


// Message receiving functions

function handleUpdate(content) { 
    const players = content.players;
    for (const [id, playerData] of Object.entries(players)) {
        console.log("Updating player: " + id + " with data: ");
        console.log(playerData);
        updatePlayer(id, playerData);
    }

    const asteroids = content.asteroids;
    for (const [id, asteroidData] of Object.entries(asteroids)) {
        console.log("Updating asteroid: " + id + " with data: ");
        console.log(asteroidData);
        updateAsteroid(id, asteroidData);
    }

    // const stations = content.stations;                  (multiple stations implementation)
    const stations = new Array(content.station);        // (single station implementation)
    for (const [id, stationData] of Object.entries(stations)) {
        console.log("Updating station: " + id + " with data: ");
        console.log(stationData);
        updateStation(id, stationData);
    }
}