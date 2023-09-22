import g, {canvas} from "../conf/globals.js";

const pointsToWin = 20;
let frames = 0;
let lastTimestamp = 0;
let avgFrames = 0;
let lastFrames = 0;

export default function () {
    g().mainCanvas.style.border = '1px solid black';
    g().mainCanvas.getContext('2d').scale(1, 1);
    g().mainCanvas.setAttribute('width', canvas.width);
    g().mainCanvas.setAttribute('height', canvas.height);
    g().tracker.trackPlayer();

    setTimeout(frameDraw, 1000);
}


function frameDraw(timestamp) {
    g().drawing.drawGame(avgFrames);
    g().player.move();
    g().enemy.draw();
    if (g().player.points >= pointsToWin) {
        g().drawing.drawWin();
        return;
    }
    frames++;
    if (timestamp - lastTimestamp > 100) {
        avgFrames = (lastFrames + frames) / 2
        lastFrames = frames;
        frames = 0;
        lastTimestamp = timestamp;
    }
    requestAnimationFrame(frameDraw);
}