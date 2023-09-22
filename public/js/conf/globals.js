import Player from "../game/players/Player.js";
import Drawing from "../game/drawing.js";
import MouseTracker from "../game/mouse_tracker.js";
import Level from "../game/objects/Level.js";
import BaseObject from "../game/objects/BaseObject.js";
import Enemy from "../game/players/Enemy.js";

export const canvas = {
    width: window.innerWidth,
    height: window.innerHeight
}
class Globals {
    mainCanvas = document.getElementById('mainCanvas');
    player = new Player();
    enemy = new Enemy();
    drawing = new Drawing();
    tracker = new MouseTracker();
    level = new Level();
    server = new WebSocket("ws://piupiu.alpec.cu:8080");
    server_connected = false;

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
