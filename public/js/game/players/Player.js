import g, {canvas} from "../../conf/globals.js";
import {pistol} from "../weapons/pistol.js";
import MouseTracker from "../mouse_tracker.js";

export default class {
	size = 20;
	shape = 'circle';
	color = 'black';
	weapon = new pistol('red', 'player');
	position = {
		x: 0.5 * window.visualViewport.width,
		y: 0.5 * window.visualViewport.height
	};
	speed = 5;
	movement_speed = {x: this.speed, y: this.speed};
	id = null;
	controls = null;
	points = 0;

	constructor(isPlayer = false) {
		this.points = 0;
		if (isPlayer) {
			this.controls = new MouseTracker();
			this.listenEvents();
		}
	}

	#move() {
		const controls = this.controls;
		const keys = controls.keys;
		const isUp = controls.isKeyPressed('w');
		const isDown = controls.isKeyPressed('s');
		const isLeft = controls.isKeyPressed('a');
		const isRight = controls.isKeyPressed('d');
		const isDiagonal = isUp && isRight || isUp && isLeft || isDown && isRight || isDown && isLeft;
		let speedX = this.movement_speed.x;
		let speedY = this.movement_speed.y;
		if (isDiagonal) {
			speedX *= 0.7;
			speedY *= 0.7;
		}
		if (!keys.length) return;
		if (this.position.x < (canvas.width - this.size) && isRight && this.#canMove('right')) {
			this.position.x += speedX;
		}

		if (this.position.x > this.size && isLeft && this.#canMove('left')) {
			this.position.x -= speedX;
		}

		if (this.position.y < (canvas.height - this.size) && isDown && this.#canMove('down')) {
			this.position.y += speedY
		}

		if (this.position.y > this.size && isUp && this.#canMove('up')) {
			this.position.y -= speedY
		}
	}

	#canMove(direction) {
		let targetX = this.position.x;
		let targetY = this.position.y;
		switch (direction) {
			case 'up':
				targetY -= this.size;
				break;
			case 'down':
				targetY += this.size;
				break;
			case 'left':
				targetX -= this.size;
				break;
			case 'right':
				targetX += this.size;
				break;
		}

		let thereIsObject = g().level.inBoundLeptons(targetX, targetY, this.size);

		return !thereIsObject;
	}

	draw() {
		this.#move();
		if (this.shape === 'circle') {
			g().drawing.drawCircle(this.position.x, this.position.y, this.size, this.color);
		}

		const dx = this.controls.position.x - this.position.x;
		const dy = this.controls.position.y - this.position.y;
		const angle = Math.atan2(dy, dx);
		this.weapon.draw(this.position.x, this.position.y, angle, this.size);
	}

	listenEvents() {
		document.getElementById('mainCanvas').addEventListener('hit-enemy', () => {
			this.points++;
		})
	}
}