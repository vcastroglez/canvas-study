import g, {canvas} from "./Globals.js";

g().mainCanvas.style.border = '1px solid black';
g().mainCanvas.getContext('2d').scale(1, 1);
g().mainCanvas.setAttribute('width', canvas.width);
g().mainCanvas.setAttribute('height', canvas.height);
g().tracker.trackPlayer();
const pointsToWin = 20;
let frames = 0;
let lastTimestamp = 0;
let avgFrames = 0;
let lastFrames = 0;

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

setTimeout(frameDraw, 1000);

// Connection opened
g().server.addEventListener("open", (event) => {
    g().server_connected = true;
    g().server.send("ping");
});
g().server.addEventListener("close", (event) => {
    g().server_connected = false;
});

// Listen for messages
g().server.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    console.log(`MSG: ${event.data}`);
    if (data.action == 'enemy') {
        const info = data.data;
        g().enemy.id = info.player;
        g().enemy.setPosition(info.position?.x,info.position?.y);
        setInterval(() => {
            g().server.send(JSON.stringify({'action': 'update-enemy', 'id': info.player}));
        }, 40)
    } else if (data.action == 'update-enemy') {
        const info = data.data;
        g().enemy.setPosition(info.position?.x,info.position?.y);
    } else if (data.action == 'no-enemy') {
        setTimeout(() => {
            g().server.send(JSON.stringify({'action': 'get-enemy'}));
        }, 3000);
        console.log("no enemy found, retrying in 3 seconds");
    }
});