import g from "../conf/globals.js";

export default class {
	drawCircle(x, y, radius, color) {
		let ctx = g().getCtx();
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.fillStyle = color;
		ctx.fill();
		ctx.font = `14px serif`;
		// ctx.fillStyle = color=='white'?'black':'white';
		ctx.fillStyle = 'black';
		let drawX = x.toFixed(0);
		let drawY = y.toFixed(0);
		drawX = drawX>1000?(drawX/1000).toFixed(1)+'k':drawX;
		drawY = drawY>1000?(drawY/1000).toFixed(1)+'k':drawY;
	}

	drawEllipse(x, y, w, h, color, kill = true) {
		if (kill && (y < 0 || y > g().selectedCanvas.height)) {
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
		ctx.clearRect(0, 0, g().selectedCanvas.width, g().selectedCanvas.height);
		ctx.font = "40px serif";
		ctx.fillStyle = 'green';
		const offset = text.length * 7.5;
		ctx.fillText(text, window.visualViewport.width / 2 - offset, window.visualViewport.height / 2);
	}

	drawText(text, size, x, y, color) {
		const ctx = g().getCtx();
		ctx.save();
		ctx.font = size + "px serif";
		ctx.fillStyle = color;
		ctx.fillText(text, x, y);
		ctx.restore();
	}

	drawLine(A, B, size, color) {
		const ctx = g().getCtx();
		ctx.beginPath();
		ctx.moveTo(A.x,A.y);
		ctx.lineTo(B.x,B.y);
		ctx.strokeWidth = `${size}px`;
		ctx.strokeStyle = `${color}`;
		ctx.stroke();
	}
}

