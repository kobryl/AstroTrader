let socket = null;
let waitingForFirstUpdate = true;


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
            handleUpdate(data.content);
            if (waitingForFirstUpdate) {
                waitingForFirstUpdate = false;
                startGame();
                setHudVisibility(true);
                fadeOutLanding();
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
    console.log(msg);
    socket.send(msg);
}


// Message receiving functions

function handleUpdate(data) { 

}