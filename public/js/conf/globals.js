import Player from "../game/players/Player.js";
import Drawing from "../game/drawing.js";
import Level from "../game/objects/Level.js";
import Enemy from "../game/players/Enemy.js";
import Enemies from "../game/players/Enemies.js";

export const canvas = {
	width: window.innerWidth,
	height: window.innerHeight
}

class Game {
	mainCanvas = document.getElementById('mainCanvas');
	player = new Player(true);
	enemies = new Enemies();
	drawing = new Drawing();
	level = new Level();
	server = new WebSocket("ws://81.28.6.236:8080");//"ws://piupiu.alpec.cu:8080"
	server_connected = false;
	stopGame = false;

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
		this.mainCanvas.height = window.innerHeight;
		this.mainCanvas.width = window.innerWidth;
		this.level.draw(avgFrames);
		this.player.draw();
		this.enemies.draw();
	}
}

let instance = null;
export default function () {
	if (instance) {
		return instance;
	}
	instance = new Game();
	return instance;
}
