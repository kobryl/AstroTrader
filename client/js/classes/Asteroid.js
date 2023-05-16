class Asteroid extends InteractableObject {
    constructor(name, id, x, y, resLeft, richness) {
        super(x, y, asteroidTexture, Config.ASTEROID_SCALE);
        this.name = name;
        this.id = id;
        this.resourcesLeft = resLeft;
        this.richness = richness;
    }

    update(data) {
        super.update(data);
        this.name = data.name;
        this.resourcesLeft = data.resources_left;
        this.richness = data.richness;

        const menu = document.querySelector("#active-menu");
        if (menu && menu.querySelector(".object-id").innerHTML == this.id) {
            menu.querySelector(".asteroid-resources-value").innerHTML = Math.round(this.resourcesLeft * 10) / 10;
        }
    }

    openMenu() {
        super.openMenu();

        const menu = document.querySelector("#active-menu");
        menu.querySelector(".object-name").innerHTML = this.name;
        menu.querySelector(".object-id").innerHTML = this.id;
        menu.querySelector(".object-type").innerHTML = "Asteroid";
        menu.querySelector(".asteroid-contents").style.display = "initial";
        menu.querySelector(".asteroid-resources-value").innerHTML = Math.round(this.resourcesLeft * 10) / 10;

        let richnessColor = {r: 255, g: 255, b: 0};
        if (this.richness < 0.5) {
            richnessColor.r = 255;
            richnessColor.g = Math.round(255 * (this.richness * 2));
            richnessColor.b = 0;
        } else {
            richnessColor.r = Math.round(255 * (1 - ((this.richness - 0.5) * 2)));
            richnessColor.g = 255;
            richnessColor.b = 0;
        }
        menu.querySelector(".asteroid-richness-value").innerHTML = Math.round(this.richness * 1000) / 10 + "%";
        menu.querySelector(".asteroid-richness-value").style.color = "rgb(" + richnessColor.r + "," + richnessColor.g + "," + richnessColor.b + ")";

        menu.querySelector(".asteroid-actions .mine-button").onclick = () => { onMineClick(this.id); };
        menu.querySelector(".asteroid-actions .mine-button").style.cursor = "pointer";
        menu.querySelector(".asteroid-actions .mine-button").style.color = "white";
        menu.querySelector(".asteroid-actions .mine-button").style.backgroundColor = "#414656";
    }
}