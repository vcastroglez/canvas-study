import {canvas} from "./Globals.js";

export default class {
    position = {
        x: 0.5,
        y: 0.2
    }

    shape = 'circle'
    size = 20

    getPosition() {
        return {x: canvas.width * this.position.x, y: canvas.height * this.position.y}
    }
}