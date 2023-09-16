import globals, {canvas} from "../Globals.js";

export default class {
    radius = 0;
    x = 0;
    y = 0;
    color = 'red';

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} r redius
     * @param {string} color
     * @param xd direction in x
     * @param yd direction in y
     * @param s speed
     */
    constructor(x, y, r, color, xd = 1, yd = 0, s = 5) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = r
        this.speed = s;
        this.xDirection = xd;//1 or -1
        this.yDirection = yd;//1 or -1
        this.pcc = false;//player can crash
    }

    inBound(x, y) {
        const c1 = x - this.x;
        const c2 = y - this.y;
        const d = Math.sqrt(Math.pow(c1, 2) + Math.pow(c2, 2));
        return d < this.radius;
    }

    fixBounds() {
        if (this.x < 0 || this.x > canvas.width) {
            this.xDirection *= -1;
        }

        if (this.y < 0 || this.y > canvas.height) {
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