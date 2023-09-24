import globals from "../../conf/globals.js";
import bullet from "./projectile/bullet.js";
import g from "../../conf/globals.js";

export class pistol {
    projectile = {
        shape: bullet,
        type: 'physical',
        fire_interval: 0.1,
        speed: 1,
        weight: 1,
        color: 'red',
    }
    color = 'red';
    body = 'circle';
    size = 5;
    position = {
        x: 0,
        y: 0
    }
    theta = 0;
    last_shoot = 0;

    constructor(color) {
        this.color = color || 'red';
        this.projectile.color = this.color;
    }
    fire() {
        const now = Date.now();
        if ((now - this.last_shoot) > this.projectile.fire_interval * 1000) {
            this.last_shoot = now;
            globals().drawing.projectiles.push(new this.projectile.shape(
                this.position.x - this.size,
                this.position.y - this.size,
                this.projectile.speed,
                g().player.weapon.theta,
                this.projectile.color));
        }
    }
}