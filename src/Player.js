import {weapons} from './Weapons.js';
import {canvas} from "./Globals.js";
import g from "./Globals.js";

const default_player_movement_speed = {x: 0.001, y: 0.002};//todo quita la caca de porcientos estos
const default_player_size = 20;
const default_player_shape = 'circle';
const default_player_color = 'gray';
const default_player_weapon = weapons.pistol;
const default_player_position = {
    x: 0.5,//todo convert this to real x and y
    y: 0.95
};

export default class {
    size = default_player_size;
    shape = default_player_shape;
    color = default_player_color;
    weapon = default_player_weapon;
    position = default_player_position;
    movement_speed = default_player_movement_speed;

    getPosition() {
        return {x: canvas.width * this.position.x, y: canvas.height * this.position.y}
    }

    constructor() {
        this.points = 0;
    }

    move() {
        const tracker = g().tracker;
        const keys = tracker.keys;
        if (!keys.length) return;
        if (tracker.isKeyPressed('d')) {
            this.position.x += this.movement_speed.x;
        }

        if (tracker.isKeyPressed('a')) {
            this.position.x -= this.movement_speed.x;
        }

        if (tracker.isKeyPressed('s')) {
            this.position.y += this.movement_speed.y
        }

        if (tracker.isKeyPressed('w')) {
            this.position.y -= this.movement_speed.y
        }

        if (this.position.x < 0 || this.position.x > 1) {
            g().tracker.keys = [];
        }
    }
}