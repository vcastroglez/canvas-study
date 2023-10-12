import g from "../../conf/globals.js";
import bullet from "./projectile/bullet.js";

export class pistol {
	projectile_info = {
		shape: bullet,
		type: 'physical',
		fire_interval: 0.1,
		speed: 3,
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

	constructor(color, stack) {
		this.color = color || 'red';
		this.projectile_info.color = this.color;
		this.stack = stack;
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

	draw(mouseX, mouseY, playerX, playerY, size) {
		const dx = mouseX - playerX;
		const dy = mouseY - playerY;
		this.theta = Math.atan2(dy, dx);
		this.position.x = playerX + (size + this.size * 1.5) * Math.cos(this.theta)
		this.position.y = playerY - (size + this.size * 1.5) * Math.sin(-this.theta)
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
				const enemyHit = g().enemies.inBound(proj.x, proj.y);
				const bosonHit = g().level.inBoundBosons(proj.x, proj.y, proj.size);
				const leptonHit = g().level.inBoundLeptons(proj.x, proj.y, proj.size);
				if (enemyHit || bosonHit) {
					let event = new CustomEvent("hit-enemy");
					document.getElementById('mainCanvas').dispatchEvent(event);
				}
				isFinished = enemyHit || bosonHit || leptonHit;
			}
			hit = isFinished || g().drawing.drawEllipse(
				proj.x,
				proj.y,
				proj.size,
				proj.size,
				proj.color,
				true);
		}

		if (hit) {
			this.deleteProjectile(index);
		}
	}

	deleteProjectile(index) {
		this.projectiles.splice(index, 1);
	}
}