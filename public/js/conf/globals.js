import Player from "../game/players/Player.js";
import Drawing from "../game/drawing.js";
import Level from "../game/objects/Level.js";
import Enemies from "../game/players/Enemies.js";

export const canvas = {
	width: 5000, height: 5000
}

class Game {
	mainCanvas = document.getElementById('mainCanvas');
	levelCanvas = document.getElementById('levelCanvas');
	miniCanvas = document.getElementById('miniCanvas');
	player = new Player(true);
	enemies = new Enemies();
	drawing = new Drawing();
	level = new Level();
	server = null;
	server_connected = false;
	stopGame = false;
	selectedCanvas = document.getElementById('mainCanvas');
	minimap = {
		width: "15vh",
		height: "15vh"
	}

	constructor() {
		this.viewportWidth = window.visualViewport.width;
		this.viewportHeight = window.visualViewport.height;
	}

	connect() {
		let identity = localStorage.getItem('identity');
		if (!identity) {
			alert("You need to set your name :(");
			throw new Error("You need username, refresh the page");
		}
		const url = document.getElementById('WS_URL').content + "/" + identity;
		this.server = new WebSocket(url);
	}

	useMain() {
		this.selectedCanvas = document.getElementById('mainCanvas');
	}

	useLevel() {
		this.selectedCanvas = document.getElementById('levelCanvas');
	}

	getCtx() {
		return this.selectedCanvas.getContext('2d');
	}

	getMCtx() {
		return this.mainCanvas.getContext('2d');
	}

	getLCtx() {
		return this.levelCanvas.getContext('2d');
	}

	setUpCanvas() {
		this.mainCanvas.style.border = '1px solid black';
		this.mainCanvas.getContext('2d').scale(1, 1);
		this.mainCanvas.setAttribute('width', canvas.width);
		this.mainCanvas.setAttribute('height', canvas.height);

		this.levelCanvas.style.border = '1px solid black';
		this.levelCanvas.getContext('2d').scale(1, 1);
		this.levelCanvas.setAttribute('width', canvas.width);
		this.levelCanvas.setAttribute('height', canvas.height);

		this.miniCanvas.style.border = '1px solid black';
		this.miniCanvas.getContext('2d').scale(1, 1);
		this.miniCanvas.style.width = `min(${this.minimap.width},170px)`;
		this.miniCanvas.style.height = `min(${this.minimap.height},170px)`;
	}

	draw(avgFrames) {
		const x = this.player.position.x - this.viewportWidth;
		const y = this.player.position.y - this.viewportHeight;
		this.getMCtx().clearRect(0, 0, this.viewportWidth, this.viewportHeight);
		this.level.draw(avgFrames);
		this.getMCtx().save();
		const xPos = -this.player.position.x + (window.visualViewport.width * 0.5);
		const yPos = -this.player.position.y + (window.visualViewport.height * 0.5);
		this.getMCtx().translate(xPos, yPos);

		this.levelCanvas.style.left = `${xPos}px`;
		this.levelCanvas.style.top = `${yPos}px`;
		this.player.draw();
		this.enemies.draw();

		this.getMCtx().restore();
	}

	drawBackground() {
		this.useLevel();
		for (let i = 0; i < canvas.width; i += canvas.width / 100) {
			const A = {x: i, y: 0};
			const B = {x: i, y: canvas.height};
			this.drawing.drawLine(A, B, 4, 'rgba(0,0,0,0.2)');
			const A2 = {x: 0, y: i};
			const B2 = {x: canvas.width, y: i};
			this.drawing.drawLine(A2, B2, 4, 'rgba(0,0,0,0.2)');
		}
		this.useMain();
	}

	drawMinimap() {
		const p = this.player.position;
		const mcW = canvas.width;
		const mcH = canvas.height;

		const mmW = this.miniCanvas.width;
		const mmH = this.miniCanvas.height;

		const targetMMX = (p.x / mcW) * mmW;
		const targetMMH = (p.y / mcH) * mmH;

		const ctx = this.miniCanvas.getContext('2d');
		ctx.clearRect(0, 0, mmW, mmH);
		const enemies = this.enemies.enemies.map(item => {
			if (!item.position) {
				return {x: -10, y: -10};
			}
			return {x: ((item.position.x / mcW) * mmW), y: (item.position.y / mcH) * mmH}
		});
		const toDraw = [{x: targetMMX, y: targetMMH}, ...enemies];
		toDraw.forEach((people, index) => {
			ctx.save();
			ctx.fillStyle = index == 0 ? '#000000' : '#ff0000';
			ctx.beginPath();
			ctx.arc(people.x, people.y, 10, 0, 2 * Math.PI);
			ctx.fill();
			ctx.restore();
		});
	}

	lerp(A, B, T) {
		return A + (B - A) * T;
	}

	inBound(x, y) {
		if (x < 0 || y < 0 || x > this.selectedCanvas.width || y > this.selectedCanvas.height) {
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
