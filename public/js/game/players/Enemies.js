import g from "../../conf/globals.js";

export default class {

	enemies = [];

	constructor() {
	}

	draw() {
		this.drawUI();
		this.enemies.forEach((enemy) => {
			this.drawEnemy(enemy);
		})
	}

	inBound(x, y, r) {
		let isInBound = false;
		for (let i = 0; i < this.enemies.length; i++) {
			const enemy = this.enemies[i];
			const c1 = x - enemy.position.x;
			const c2 = y - enemy.position.y;
			const d = Math.sqrt(Math.pow(c1, 2) + Math.pow(c2, 2));
			const touching = d <= ((enemy.info.size / 2) + r / 2);
			console.log(enemy.info.size);
			if (touching) {
				isInBound = true;
				break;
			}
		}

		return isInBound;
	}

	drawEnemy(enemy) {
		if (!enemy || !enemy.position) return;
		g().drawing.drawCircle(enemy.position.x, enemy.position.y, enemy.info.size, 'red');
	}

	drawUI() {
		let points = this.enemies.map(enemy => {
			return enemy.info.points;
		}).sort((a, b) => a - b);

		points.forEach((point, index) => {
			g().drawing.drawText(`player ${index}: ${points}`, 25, 10, (index + 2) * 40, 'lightblue');
		})
	}
}