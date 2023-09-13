import globals from "../Globals.js";

export default class {
    radius = 0;
    x= 0;
    y= 0;
    color = 'red';

    constructor(x,y,r,color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = r
    }
    inBound(x,y){
        const c1 = x - this.x;
        const c2 = y - this.y;
        const d = Math.sqrt(Math.pow(c1,2) + Math.pow(c2,2));
        return d<this.radius;
    }

    draw(){
        globals().drawing.drawCircle(this.x,this.y,this.radius,this.color);
    }
}