import Player from "../game/players/Player.js";
import Drawing from "../game/drawing.js";
import Level from "../game/objects/Level.js";
import Enemies from "../game/players/Enemies.js";

export const canvas = {
	width: window.innerWidth, height: window.innerHeight
}

class Game {
	mainCanvas = document.getElementById('mainCanvas');
	player = new Player(true);
	enemies = new Enemies();
	drawing = new Drawing();
	level = new Level();
	server = null;
	server_connected = false;
	stopGame = false;

	constructor() {
		const url = document.getElementById('WS_URL').content;
		this.server = new WebSocket(url);//
	}

	getCtx() {
		return this.mainCanvas.getContext('2d');
	}

	setUpCanvas() {
		this.mainCanvas.style.border = '1px solid black';
		this.mainCanvas.getContext('2d').scale(1, 1);
		this.mainCanvas.setAttribute('width', canvas.width);
		this.mainCanvas.setAttribute('height', canvas.height);
	}

	draw(avgFrames) {
		this.mainCanvas.height = 2000;
		this.mainCanvas.width = 3200;
		this.level.draw(avgFrames);
		this.player.draw();
		this.enemies.draw();
	}

	inBound(x, y) {
		if (x < 0 || y < 0 || x > this.mainCanvas.width || y > this.mainCanvas.height) {
			return false;
		}
		return true;
	}
}

let instance = null;
export default function () {
	if (instance) {
		return instance;
	}
	console.log(`xxxxxxxxxxxxxx`);
	instance = new Game();
	return instance;
}
