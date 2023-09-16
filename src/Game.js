import g from "./Globals.js";

g().mainCanvas.style.border = '1px solid black';
g().mainCanvas.getContext('2d').scale(1,1);
g().mainCanvas.setAttribute('width',g().canvas.width);
g().mainCanvas.setAttribute('height',g().canvas.height);
g().tracker.trackPlayer();
function frameDraw(){
    g().drawing.drawGame();
    if(g().player.points>9){
        g().drawing.drawWin();
        return;
    }
    requestAnimationFrame(frameDraw);
}

frameDraw();