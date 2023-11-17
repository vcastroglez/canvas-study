import g from "../conf/globals.js";

const pointsToWin = 20;
let frames = 0;
let lastTimestamp = 0;
let fpsTimestamp = 0;
let avgFrames = 0;
let lastFrames = 0;
const targetFPSTS = 16;

export default function () {
	g().setUpCanvas();
	g().drawing.drawWholePageText("Loading...");
	g().getMCtx().save();
	g().getLCtx().save();
	g().getMCtx().translate(g().player.position.x, g().player.position.y);
	g().getLCtx().translate(g().player.position.x, g().player.position.y);
	g().getMCtx().restore();
	g().getLCtx().restore();
	g().drawBackground();
	setTimeout(frameHandle, 1000);
}

export async function checkForName() {
	let name = null;
	let pass = null;
	if (localStorage.getItem('identity')) {
		name = localStorage.getItem('identity');
		pass = prompt(`Hello ${name}, tell me your PIN`);
	} else {
		name = prompt("Give me a name for you please :)");
		pass = prompt(`Hello ${name}, and what's your PIN?`);
	}
	const data = await (await fetch(`/check-identity?name=${name}&pass=${pass}`)).json();
	if (data.success) {
		localStorage.setItem('identity', name);
	}
}

function frameHandle(timestamp) {
	g().stopGame = false;
	if (timestamp - lastTimestamp > targetFPSTS) {
		frames++;
		if (frames > 100000) {
			frames = lastFrames = 0;
		}
		if (timestamp - fpsTimestamp > 1000) {
			avgFrames = frames - lastFrames;
			lastFrames = frames;
			fpsTimestamp = timestamp;
		}
		frameDraw(timestamp);
		lastTimestamp = timestamp;
	}

	requestAnimationFrame(frameHandle);
}

function frameDraw() {
	g().draw(avgFrames);
	if (g().player.points >= pointsToWin || g().stopGame) {
		g().drawing.drawWholePageText("Felicidades te ganaste un cake comepinga");
		return;
	}

	if (g().server_connected) {
		const request = {
			route: 'self-status',
			data: {
				position: g().player.position,
				stats: {
					size: g().player.size,
					points: g().player.points,
				},
				mouse: g().player.controls.position,
				proj: g().player.weapon.projectiles
			}
		}

		g().server.send(JSON.stringify(request));
	}
}