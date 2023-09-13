import globals from "../Globals.js";

export default class {
    width = 0;
    height = 0;
    rotation = 0;
    x= 0;
    y= 0;
    color = 'red';

    constructor(x,y,w,h,color, rotation) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = color;
        this.rotation = rotation
    }
    inBound(x,y){
        return x > (this.x - this.width/2) && x < (this.x + this.width/2) && y > (this.y - this.height/2) && y < (this.y + this.height/2);
    }

    draw(){
        if(!this.rotation) {
            const ctx = globals().ctx();
            ctx.rect(this.x - (this.width/2), this.y - (this.height/2), this.width, this.height);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
}