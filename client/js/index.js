let socket = null;


function resize() {
    game.renderer.resize(window.innerWidth, window.innerHeight);
}

function connect(address, username) {
    socket = new WebSocket(address);

    socket.addEventListener("open", () => {
        console.log("Connected to server.");
        content = { name: username };
        const initMsg = createMessage(ServerMessages.INIT, content);
        socket.send(initMsg);
    });
    
    socket.addEventListener("message", (event) => {
        handleMessage(event.data);
    });
}

function createMessage(type, content) {
    return JSON.stringify({ type: type, content: content });
}

function handleMessage(data) {
    message = JSON.parse(data);
    console.log("Received message (" + message.type + "): ");
    console.log(message.content);
}


document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#canvas-container").appendChild(game.view);
    window.addEventListener("resize", resize);
    resize();
});