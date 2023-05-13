function onResize() {
    game.renderer.resize(window.innerWidth, window.innerHeight);
    centerOnPlayer();
}


document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#canvas-container").appendChild(game.view);
    window.addEventListener("resize", onResize);
    onResize();
    setHudVisibility(false);
    document.querySelector("#active-menu").addEventListener("click", (e) => { e.stopPropagation(); });
 });