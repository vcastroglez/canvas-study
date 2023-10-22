import g from "../../conf/globals.js";

export default class {
	bosonObjects = [];
	leptonObjects = [];

	constructor() {
		this.bosonObjects = [];
		this.leptonObjects = [];
		this.buildLevel();
	}

	buildLevel() {
		// this.bosonObjects.push(
		// 	new circle(
		// 		Math.round(Math.random() * canvas.width),
		// 		Math.round(Math.random() * canvas.height),
		// 		10,
		// 		'#e7b63f',
		// 		0.3,
		// 		0.3,
		// 		7)
		// );
		// this.leptonObjects.push(
		// 	new box(
		// 		111,
		// 		111,
		// 		111,
		// 		20,
		// 		'#3fe7ce'
		// 	)
		// );
	}

	draw(avgFrames) {
		this.drawUI(avgFrames);
		this.bosonObjects.forEach((el) => {
			el.draw()
		});
		this.leptonObjects.forEach((el) => {
			el.draw()
		});
	}

	inBoundBosons(x, y, size) {
		for (let i = 0; i < this.bosonObjects.length; i++) {
			if (this.bosonObjects[i].inBound(x, y, size)) {
				return true;
			}
		}
	}

	inBoundLeptons(x, y, size) {
		for (let i = 0; i < this.leptonObjects.length; i++) {
			if (this.leptonObjects[i].inBound(x, y, size)) {
				return true;
			}
		}
	}

	drawUI(avgFrames) {
		const ctx = g().getCtx();
		g().drawing.drawText("Points: " + g().player.points, 36, 10, 50, 'red');
		g().drawing.drawText("FPS: " + avgFrames, 36, window.innerWidth - 200, 50, 'red');
		g().enemies.points.forEach((points, index) => {
			g().drawing.drawText(`enemy ${index + 1}: ${points}`, 20, 10, ((index + 2) * 40) + 10, 'red');
		})
	}
}