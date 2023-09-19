import globals from "../../Globals.js";

export default class {
    speed = 1;
    speed_rate = 5;
    theta = 1;
    shape = 'bullet';
    size = 10;
    x = 0;
    y = 0;
    color = 'blue';
    constructor(x,y,speed, theta, color) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.theta = theta;
        this.color = color;
    }

    //inclination
    //size
    //speed

}