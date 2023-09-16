import {weapons} from './Weapons.js';
import g, {canvas} from "./Globals.js";

const default_player_size = 20;
const default_player_shape = 'circle';
const default_player_color = 'gray';
const default_player_weapon = weapons.pistol;

export default class {
    size = default_player_size;
    shape = default_player_shape;
    color = default_player_color;
    weapon = default_player_weapon;
    position = {
        x: 0.5 * canvas.width,//todo convert this to real x and y
        y: 0.95 * canvas.height
    };
    speed = 0.003;
    movement_speed = {x: canvas.width * this.speed, y: canvas.width * this.speed};

    getPosition() {
        return {x: this.position.x, y: this.position.y}
    }

    constructor() {
        this.points = 0;
    }

    move() {
        const tracker = g().tracker;
        const keys = tracker.keys;
        if (!keys.length) return;
        if (this.position.x < canvas.width && tracker.isKeyPressed('d')) {
            this.position.x += this.movement_speed.x;
        }

        if (this.position.x > 0 && tracker.isKeyPressed('a')) {
            this.position.x -= this.movement_speed.x;
        }

        if (this.position.y < canvas.height && tracker.isKeyPressed('s')) {
            this.position.y += this.movement_speed.y
        }

        if (this.position.y > 0 && tracker.isKeyPressed('w')) {
            this.position.y -= this.movement_speed.y
        }
    }
}