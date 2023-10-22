import Player from "../game/players/Player.js";
import Drawing from "../game/drawing.js";
import Level from "../game/objects/Level.js";
import Enemies from "../game/players/Enemies.js";
import drawing from "../game/drawing.js";

export const canvas = {
	width: 5000, height: 5000
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
	bgImg = null;

	constructor() {
		const url = document.getElementById('WS_URL').content;
		this.server = new WebSocket(url);
		this.viewportWidth = window.visualViewport.width;
		this.viewportHeight = window.visualViewport.height;
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
		const x = this.player.position.x - this.viewportWidth;
		const y = this.player.position.y - this.viewportHeight;
		this.getCtx().clearRect(0, 0, this.viewportWidth, this.viewportHeight);
		this.level.draw(avgFrames);
		this.getCtx().save();
		this.getCtx().translate(-this.player.position.x + (window.visualViewport.width * 0.5), -this.player.position.y + (window.visualViewport.height * 0.5));
		this.drawBackground();
		this.player.draw();
		this.enemies.draw();
		this.getCtx().restore();
	}

	drawBackground(){
		for (let i = 0 ;i < canvas.width; i += canvas.width/100){
			const A = {x:i,y:0};
			const B = {x:i,y:canvas.height};
			this.drawing.drawLine(A,B,4,'black');
			const A2 = {x:0,y:i};
			const B2 = {x:canvas.width,y:i};
			this.drawing.drawLine(A2,B2,4,'black');
		}
	}

	lerp (A, B, T){
		return A + (B-A) * T;
	}

	inBound(x, y) {
		if (x < 0 || y < 0 || x > this.mainCanvas.width || y > this.mainCanvas.height) {
			return false;
		}
		return true;
	}

	getAngle(cx, cy, ex, ey) {
		const dy = ey - cy;
		const dx = ex - cx;
		return Math.atan2(dy, dx);
	}
}

let instance = null;
export default function () {
	if (instance) {
		return instance;
	}
	console.log(`Instance created`);
	instance = new Game();
	return instance;
}
