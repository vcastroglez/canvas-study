import circle from "./circle.js";
import {canvas} from "../../conf/globals.js";
import Box from "./box.js";

export default class {
    objects = [];
    constructor() {
        this.objects = [];
        this.buildLevel();
    }

    buildLevel() {
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