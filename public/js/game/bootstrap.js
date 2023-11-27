import g from "../conf/globals.js";

const pointsToWin = 200;
const targetFPSTS = 16;

export default function () {
	g().connect();
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
	return new Promise(async (success) => {
		let name = null;
		if (session.uuid !== null) {
			name = session.uuid;
		} else {
			throw new Error("How you got here?");
		}
		success(true);
	});
}

function frameHandle(timestamp) {
	g().stopGame = false;
	frameDraw(timestamp);
	requestAnimationFrame(frameHandle);
}

function frameDraw(ts) {
	if (g().player.points >= pointsToWin || g().stopGame) {
		g().drawing.drawWholePageText("Felicidades te ganaste un cake comepinga");
		throw new Error("Game finish :)");
	}

	if (!g().server_connected) {
		throw new Error("No server connection");
	}

	g().draw(ts);

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