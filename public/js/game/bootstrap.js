import g, {canvas} from "../conf/globals.js";

const pointsToWin = 20;
let frames = 0;
let lastTimestamp = 0;
let fpsTimestamp = 0;
let avgFrames = 0;
let lastFrames = 0;
const targetFPSTS = 15;

export default function () {
	g().mainCanvas.style.border = '1px solid black';
	g().mainCanvas.getContext('2d').scale(1, 1);
	g().mainCanvas.setAttribute('width', canvas.width);
	g().mainCanvas.setAttribute('height', canvas.height);
	g().tracker.trackPlayer();

	setTimeout(frameDraw, 1000);
}


function frameDraw(timestamp) {
	if (timestamp - lastTimestamp > targetFPSTS) {
		frames++;
		if(frames>100000){
			frames = lastFrames = 0;
		}
		if(timestamp - fpsTimestamp>1000) {
			avgFrames = frames - lastFrames;
			lastFrames = frames;
			fpsTimestamp = timestamp;
		}
		frameHandle(timestamp);
		lastTimestamp = timestamp;
	}

	requestAnimationFrame(frameDraw);
}

function frameHandle(timestamp){
	g().drawing.drawGame(avgFrames);
	g().player.move();
	g().enemy.draw();
	if (g().player.points >= pointsToWin) {
		g().drawing.drawWin();
		return;
	}

	if (g().server_connected) {//tovla todo unify this
		g().server.send(JSON.stringify(
			{
				action: 'position',
				data: g().player.position,
				info: {
					size: g().player.size,
					points: g().player.points,
					projectiles: g().drawing.projectiles,
				}
			}
		));
		g().server.send(JSON.stringify({action: 'mouse', data: g().tracker.position}));
	}
}