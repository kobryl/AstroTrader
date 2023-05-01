let socket = null;


function resize() {
    game.renderer.resize(window.innerWidth, window.innerHeight);
}

function connect() {
    let address = document.querySelector("#connect-popup-input").value;
    if (address == "") return;
    address = "ws://" + address + ":" + config.server_port;
    socket = new WebSocket(address);

    socket.addEventListener("open", () => {
        console.log("Connected to server.");
        fadeOutLanding();
    });
    
    socket.addEventListener("message", (event) => {
        console.log(event.data);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#canvas-container").appendChild(game.view);
    window.addEventListener("resize", resize);
    resize();
});