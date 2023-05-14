let socket = null;
let waitingForFirstUpdate = false;
let waitingForConfirmation = true;
let assignedClientId = null;
let serverDeltaTime = 0;


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
            }
            break;
        case ServerMessages.CONFIRM_CONNECTION:
            const status = data.content.status;
            if (status === "ok") {
                waitingForFirstUpdate = true;
                waitingForConfirmation = false;
                assignedClientId = data.content.id;
                console.log("client id: " + assignedClientId);
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
    serverDeltaTime = content.server_delta_time;
    for (const [id, playerData] of Object.entries(players)) {
        console.log("Updating player: " + id + " with data: ");
        console.log(playerData);
        updatePlayer(id, playerData);
    }
}