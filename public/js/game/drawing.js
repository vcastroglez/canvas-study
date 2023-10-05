import g from "../conf/globals.js";

export default class {
	drawCircle(x, y, radius, color) {
		let ctx = g().getCtx();
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.fillStyle = color;
		ctx.fill();
	}

	drawEllipse(x, y, w, h, color, kill = true) {
		if (kill && (y < 0 || y > g().mainCanvas.height)) {
			return true;
		}
		let ctx = g().getCtx();
		var kappa = .5522848,
			ox = (w / 2) * kappa, // control point offset horizontal
			oy = (h / 2) * kappa, // control point offset vertical
			xe = x + w,           // x-end
			ye = y + h,           // y-end
			xm = x + w / 2,       // x-middle
			ym = y + h / 2;       // y-middle

		ctx.fillStyle = 'black';
		ctx.beginPath();
		ctx.moveTo(x, ym);
		ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
		ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
		ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
		ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
		ctx.fillStyle = color;
		ctx.fill();
		return false;
	}

	drawWholePageText(text) {
		const ctx = g().getCtx();
		ctx.clearRect(0, 0, g().mainCanvas.width, g().mainCanvas.height);
		ctx.font = "40px serif";
		ctx.fillStyle = 'green';
		const offset = text.length * 7.5;
		ctx.fillText(text, g().mainCanvas.width / 2 - offset, g().mainCanvas.height / 2);
	}
}

