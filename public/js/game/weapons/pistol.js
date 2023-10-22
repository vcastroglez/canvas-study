import g from "../../conf/globals.js";
import bullet from "./projectile/bullet.js";

export class pistol {
	projectile_info = {
		shape: bullet,
		type: 'physical',
		fire_interval: 0.1,
		speed: 6,
		weight: 1,
		color: 'red',
	};
	projectiles = [];
	color = 'red';
	body = 'circle';
	size = 5;
	position = {
		x: 0,
		y: 0
	}
	theta = 0;
	last_shoot = 0;
	autofire = false;

	constructor(color, stack) {
		this.color = color || 'red';
		this.projectile_info.color = this.color;
		this.stack = stack;
		document.getElementById('mainCanvas').addEventListener("player-shooting", event => {
			event.preventDefault();
			if (event.detail.angle) {
				this.theta = event.detail.angle;
				this.autofire = true;
			}
		}, {passive: false});
		document.getElementById('mainCanvas').addEventListener("player-not-shooting", event => {
			event.preventDefault();
			this.autofire = false;
		}, {passive: false});
	}

	fire() {
		const now = Date.now();
		if ((now - this.last_shoot) > this.projectile_info.fire_interval * 1000) {
			this.last_shoot = now;
			this.projectiles.push(new this.projectile_info.shape(
				this.position.x - this.size,
				this.position.y - this.size,
				this.projectile_info.speed,
				this.theta,
				this.projectile_info.color));
		}
	}

	draw(x, y, angle, size) {
		if (this.autofire) {
			x = g().player.position.x;
			y = g().player.position.y;
			size = g().player.size;
			angle = this.theta;
			this.fire();
		} else {
			this.theta = angle;
		}
		this.position.x = x + (size + this.size * 1.5) * Math.cos(angle)
		this.position.y = y - (size + this.size * 1.5) * Math.sin(-angle)
		if (this.body === 'circle') {
			g().drawing.drawCircle(this.position.x, this.position.y, this.size, this.color);
		}

		this.drawProjectiles();
	}

	drawProjectiles() {
		this.projectiles?.forEach((proj, index) => {
			this.drawProjectile(proj, index, this.stack);
		})
	}

	drawProjectile(proj, index) {
		let hit = false
		if (proj.shape === 'bullet') {
			proj.y = proj.y + ((proj.speed * proj.speed_rate) * Math.sin(proj.theta));
			proj.x = proj.x + ((proj.speed * proj.speed_rate) * Math.cos(proj.theta));

			let isFinished = false;
			if (this.stack === 'player') {
				const enemyHit = g().enemies.inBound(proj.x, proj.y, proj.size);
				const bosonHit = g().level.inBoundBosons(proj.x, proj.y, proj.size);
				const leptonHit = g().level.inBoundLeptons(proj.x, proj.y, proj.size);
				const outOfBound = !g().inBound(proj.x, proj.y);
				if (enemyHit) {
					let event = new CustomEvent("hit-enemy");
					document.getElementById('mainCanvas').dispatchEvent(event);
				}
				isFinished = enemyHit || leptonHit || outOfBound;
			}
			hit = isFinished || g().drawing.drawCircle(
				proj.x,
				proj.y,
				proj.size,
				proj.color,
				);
		}

		if (hit) {
			this.deleteProjectile(index);
		}
	}

	deleteProjectile(index) {
		this.projectiles.splice(index, 1);
	}
}