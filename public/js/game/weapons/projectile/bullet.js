import globals from "../../../conf/globals.js";

export default class {
    speed = 1;
    speed_rate = 1;
    theta = 1;
    shape = 'bullet';
    size = 5;
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