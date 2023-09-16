import globals from "../Globals.js";

export default class {
    radius = 0;
    x = 0;
    y = 0;
    color = 'red';

    constructor(x, y, r, color, xd = 1, yd = 0, s = 5) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = r
        this.speed = s;
        this.xDirection = xd;//1 or -1
        this.yDirection = yd;//1 or -1
    }

    inBound(x, y) {
        const c1 = x - this.x;
        const c2 = y - this.y;
        const d = Math.sqrt(Math.pow(c1, 2) + Math.pow(c2, 2));
        return d < this.radius;
    }

    fixBounds() {
        if (this.x < 0 || this.x > globals().drawing.canvas_width) {
            this.xDirection *= -1;
        }

        if (this.y < 0 || this.y > globals().drawing.canvas_height) {
            this.yDirection *= -1;
        }
    }

    move() {
        this.x = this.x + this.speed * this.xDirection;
        this.y = this.y + this.speed * this.yDirection;
        this.fixBounds();
    }

    draw() {
        globals().drawing.drawCircle(this.x, this.y, this.radius, this.color);
    }
}