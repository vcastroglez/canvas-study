import g, {canvas} from "../../conf/globals.js";
import {pistol} from "../weapons/pistol.js";

const default_player_size = 20;
const default_player_shape = 'circle';
const default_player_color = 'gray';

export default class {
    size = default_player_size;
    shape = default_player_shape;
    color = default_player_color;
    weapon = new pistol();
    position = {
        x: 0.5 * canvas.width,
        y: 0.95 * canvas.height
    };
    speed = 0.002;
    movement_speed = {x: canvas.width * this.speed, y: canvas.width * this.speed};
    id = null;

    getPosition() {
        return this.position;
    }

    constructor() {
        this.points = 0;
    }

    move() {
        const tracker = g().tracker;
        const keys = tracker.keys;
        const isUp = tracker.isKeyPressed('w');
        const isDown = tracker.isKeyPressed('s');
        const isLeft = tracker.isKeyPressed('a');
        const isRight = tracker.isKeyPressed('d');
        if (!keys.length) return;
        if (this.position.x < (canvas.width - this.size) && isRight && this.canMove('right')) {
            this.position.x += this.movement_speed.x;
        }

        if (this.position.x > this.size && isLeft && this.canMove('left')) {
            this.position.x -= this.movement_speed.x;
        }

        if (this.position.y < (canvas.height - this.size) && isDown && this.canMove('down')) {
            this.position.y += this.movement_speed.y
        }

        if (this.position.y > this.size && isUp && this.canMove('up')) {
            this.position.y -= this.movement_speed.y
        }

        if(g().server_connected) g().server.send(JSON.stringify({action:'position',data:this.position}));
    }

    canMove(direction){
        let targetX = this.position.x;
        let targetY = this.position.y;
        switch (direction){
            case 'up': targetY -= this.size;break;
            case 'down': targetY += this.size;break;
            case 'left': targetX -= this.size;break;
            case 'right': targetX += this.size;break;
        }

        let thereIsObject = false;
        g().level.objects.every((object,index)=>{
            if(object.pcc){
                const isTouching = object.inBound(targetX,targetY);
                if(isTouching){
                    thereIsObject = true;
                    return false;
                }
            }
            return true;
        })

        return !thereIsObject;
    }
}