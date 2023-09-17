import circle from "./objects/circle.js";
import {canvas} from "./Globals.js";
import Box from "./objects/box.js";

export default class {
    objects = [];
    constructor() {
        this.objects = [];
        this.buildLevel();
    }

    buildLevel() {
        this.objects.push(new Box(300, 200, 600, 100, 'blue'));
        this.objects.push(
            new circle(
                Math.round(Math.random() * canvas.width),
                Math.round(Math.random() * canvas.height),
                10,
                '#e7b63f',
                0.3,
                0.3,
                7)
        );
        this.objects.push(
            new circle(
                Math.round(Math.random() * canvas.width),
                Math.round(Math.random() * canvas.height),
                10,
                '#3fe7ce',
                0.3,
                0.3,
                4)
        );
    }

    draw() {
        this.objects.forEach((el) => {
            el.move();
            el.draw()
        });
    }
}