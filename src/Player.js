import {weapons} from './Weapons.js';
import globals from "./Globals.js";

const default_player_movement_speed = {x:0.001,y:0.002};
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
        return {x: globals().canvas.width * this.position.x, y: globals().canvas.height * this.position.y}
    }

    constructor() {
    }
}