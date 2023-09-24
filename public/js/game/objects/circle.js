import globals, {canvas} from "../../conf/globals.js";
import BaseObject from "./BaseObject.js";

export default class extends BaseObject{
    radius = 0;
    x = 0;
    y = 0;
    color = 'red';
    pcc = false;

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
        super();
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
        if (this.x < 0 || this.x > canvas.width || !this.canMove('x')) {
            this.xDirection *= -1;
        }

        if (this.y < 0 || this.y > canvas.height || !this.canMove('y')) {
            this.yDirection *= -1;
        }
    }

    canMove(axis){
        let targetX = this.x;
        let targetY = this.y;
        if(axis === 'x' && this.xDirection>0){
            targetX += this.radius;
        } else if(axis === 'x' && this.xDirection<0){
            targetX -= this.radius;
        } else if(axis === 'y' && this.yDirection > 0){
            targetY += this.radius;
        } else {
            targetY -= this.radius;
        }

        let thereIsObject = false;
        globals().level.objects.every(obj=>{
            if(obj.pcc) {
                const isTouching = obj.inBound(targetX, targetY);
                if (isTouching) {
                    thereIsObject = true;
                    return false;
                }
            }

            return true;
        })

        return !thereIsObject;
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