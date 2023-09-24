import globals from "../../conf/globals.js";
import resolve from "../../conf/ws-router.js";
import {pistol} from "../weapons/pistol.js";

export default class {
    weapon = new pistol('blue');
    position = {
        x: -100,
        y: -100
    }
    mouse = {
        x: -100,
        y: -100
    }

    interval = {};

    inactivity = 0;
    id = null;

    shape = 'circle'
    size = 20

    getPosition() {
        return this.position;
    }

    draw() {
        globals().drawing.drawCircle(this.position.x, this.position.y, 20, 'red');
    }

    setMouse(x, y) {
        const go_on = this.checkInactivity(x, y, this.mouse.x, this.mouse.y);
        if (!go_on) return;
        this.mouse.x = x;
        this.mouse.y = y;
    }

    setPosition(x, y) {
        const go_on = this.checkInactivity(x, y, this.position.x, this.position.y);
        if (!go_on) return;
        this.position.x = x;
        this.position.y = y;
    }

    checkInactivity(newX, newY, oldX, oldY) {
        if (this.inactivity === -1) {
            return false;
        }
        if (oldX !== newX || oldY !== newY) {
            this.inactivity = 0;
        } else {
            this.inactivity++;
        }

        if (this.inactivity > 500) {
            clearInterval(this.interval);
            resolve({route: 'no-enemy'});
            this.inactivity = -1;
            return false;
        }

        return true;
    }
}