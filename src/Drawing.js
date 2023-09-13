import g from "./Globals.js";
import Box from "./objects/box.js";
import circle from "./objects/circle.js";

export default class {
    projectiles = [];
    base_position = {};
    tip_position = {};
    last_position = {};
    canvas_width = 0;
    canvas_height = 0;
    objects = [];

    drawTriangle(size, position, color) {
        let canvas = g().mainCanvas
        const ctx = canvas.getContext('2d');
        const tip_angle = 45;
        const tip_size = 20;
        ctx.beginPath();
        this.base_position = {x: this.canvas_width * position.x - (size / 2), y: this.canvas_height * position.y};
        this.fixBounds(this.base_position, this.canvas_width, this.canvas_height);

        this.tip_position = {
            x: this.base_position.x + (tip_size) * Math.cos(-tip_angle),
            y: this.base_position.y - (tip_size) * Math.sin(tip_angle)
        }
        this.last_position = {x: this.base_position.x + size, y: this.base_position.y}
        ctx.moveTo(this.base_position.x, this.base_position.y);
        ctx.lineTo(this.tip_position.x, this.tip_position.y);
        ctx.lineTo(this.last_position.x, this.last_position.y);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.fill();
    }

    fixBounds(base_position) {
        if (base_position.x > this.canvas_width - 20) {
            base_position.x = this.canvas_width - 20;
        }
        if (base_position.y > this.canvas_height) {
            base_position.y = this.canvas_height;
        }

        if (base_position.x < 0) {
            base_position.x = 0;
        }

        if (base_position.y < 20) {
            base_position.y = 20;
        }

    }

    drawCircle(x, y, radius, color) {
        let ctx = g().ctx();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    }

    drawPlayer() {
        const canvas = g().canvas;
        this.canvas_width = canvas.width;
        this.canvas_height = canvas.height;
        const player = g().player;
        if (player.shape === 'triangle') {
            this.drawTriangle(player.size, player.position, player.color);
        }
        if (player.shape === 'circle') {
            this.drawCircle(this.canvas_width * player.position.x, this.canvas_height * player.position.y, player.size, player.color);
        }
    }

    drawEllipse(x, y, w, h, color, kill = true) {
        if (kill && (y < 0 || y > this.canvas_height)) {
            return true;
        }
        let ctx = g().mainCanvas.getContext('2d');
        var kappa = .5522848,
            ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w,           // x-end
            ye = y + h,           // y-end
            xm = x + w / 2,       // x-middle
            ym = y + h / 2;       // y-middle

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(x, ym);
        ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        ctx.fillStyle = color;
        ctx.fill();
        return false;
    }

    drawProjectiles() {
        this.projectiles.forEach((proj, index) => {
            let dead = false
            if (proj.shape === 'bullet') {
                proj.y = proj.y + ((proj.speed * proj.speed_rate) * Math.sin(proj.theta));
                proj.x = proj.x + ((proj.speed * proj.speed_rate) * Math.cos(proj.theta));

                dead = this.isInBound(proj.x, proj.y) || this.drawEllipse(
                    proj.x,
                    proj.y,
                    proj.size,
                    proj.size,
                    proj.color,
                    true);
            }

            if (dead) {
                this.deleteProjectile(index);
            }
        })
    }

    isInBound(x, y) {
        let inBound = false;
        this.objects.every(el => {
            if (el.inBound(x, y)) {
                console.log(el);
                inBound = true;
                return false;
            }
            return true;
        })

        return inBound;
    }

    deleteProjectile(index) {
        this.projectiles.splice(index, 1);
    }

    drawWeapons() {
        const dy = g().tracker.position.y - g().player.getPosition().y
        const dx = g().tracker.position.x - g().player.getPosition().x;
        g().player.weapon.theta = Math.atan2(dy, dx);
        g().player.weapon.position.x = g().player.getPosition().x + (g().player.size) * Math.cos(g().player.weapon.theta)
        g().player.weapon.position.y = g().player.getPosition().y - (g().player.size) * Math.sin(-g().player.weapon.theta)
        if (g().player.weapon.body === 'circle') {
            this.drawCircle(g().player.weapon.position.x, g().player.weapon.position.y, g().player.weapon.size, g().player.weapon.color);
        }
    }

    radians = [];

    toRadians(angle) {
        if (this.radians[angle]) {
            return this.radians[angle];
        }
        this.radians[angle] = angle * (Math.PI / 180);
        return this.radians[angle];
    }


    movePlayer() {
        const tracker = g().tracker;
        const keys = tracker.keys;
        if (!keys.length) return;
        const player = g().player;
        if (tracker.isKeyPressed('d')) {
            g().player.position.x += player.movement_speed.x;
        }
        if (tracker.isKeyPressed('a')) {
            g().player.position.x -= player.movement_speed.x;
        }
        if (tracker.isKeyPressed('s')) {
            g().player.position.y += player.movement_speed.y
        }
        if (tracker.isKeyPressed('w')) {
            g().player.position.y -= player.movement_speed.y
        }
        if (g().player.position.x < 0 || g().player.position.x > 1) {
            g().tracker.keys = [];
        }
    }

    drawLevel() {
        this.objects = [];
        this.objects.push(new Box(200, 200, 200, 200, 'blue'));
        this.objects.push(new circle(400, 400, 20, 'red'));
        this.objects.forEach((el) => {
            el.draw()
        });
    }

    drawGame() {
        const ctx = g().mainCanvas.getContext('2d');
        ctx.clearRect(0, 0, g().canvas.width, g().canvas.height);
        ctx.font = "36px serif";
        ctx.fillStyle = 'red';
        ctx.fillText("Inclination: " + g().player.weapon.theta, 10, 50);
        this.drawLevel();
        this.movePlayer();
        this.drawPlayer();
        this.drawWeapons();
        this.drawProjectiles();
    }
}

