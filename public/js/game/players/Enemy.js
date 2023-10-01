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
	points = 0;

	inactivity = 0;
	id = null;

	shape = 'circle'
	size = 20;

	projectiles = [];

	getPosition() {
		return this.position;
	}

	draw() {
		globals().drawing.drawCircle(this.position.x, this.position.y, this.size, 'red');
		globals().ctx().save();
		globals().ctx().font = "30px Arial";
		globals().ctx().textAlign = "center";
		globals().ctx().textBaseline = "middle";
		globals().ctx().fillText(this.points.toString(), this.position.x, this.position.y);
		globals().ctx().restore();
	}

	setPoints(points) {
		this.points = points;
	}

	setSize(size) {
		this.size = size;
	}

	setProjectiles(proj) {
		this.projectiles = proj;
	}

	inBound(x, y) {
		const c1 = x - this.position.x;
		const c2 = y - this.position.y;
		const d = Math.sqrt(Math.pow(c1, 2) + Math.pow(c2, 2));
		return d < this.size;
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