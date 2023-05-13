let socket = null;


function onResize() {
    game.renderer.resize(window.innerWidth, window.innerHeight);
    centerOnPlayer();
}

function connect(address, username) {
    socket = new WebSocket(address);

    socket.addEventListener("open", () => {
        console.log("Connected to server.");
        content = { name: username };
        const initMsg = createMessage(ServerMessages.INIT_TYPE, content);
        socket.send(initMsg);
    });
    
    socket.addEventListener("message", (event) => {
        handleMessage(event.data);
    });
}

function createMessage(type, content) {
    return JSON.stringify({ type: type, content: content });
}

function handleMessage(message) {
    data = JSON.parse(message);
    console.log("Received message (" + data.type + "): ");
    console.log(data.content);
    return data;
}


document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#canvas-container").appendChild(game.view);
    window.addEventListener("resize", onResize);
    onResize();
    setHudVisibility(false);
});