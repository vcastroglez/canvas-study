import Player from "./Player.js";
import Drawing from "./Drawing.js";
import MouseTracker from "./MouseTracker.js";

export const canvas = {
    width: window.innerWidth,
    height: window.innerHeight
}
class Globals {
    mainCanvas = document.getElementById('mainCanvas');
    player = new Player();
    drawing = new Drawing();
    tracker = new MouseTracker();

    ctx(){
        return this.mainCanvas.getContext('2d');
    }
}

let instance = null;
export default function() {
    if(instance){
        return instance;
    }

    instance = new Globals();
    return instance;
}
