import Player from "./Player.js";
import Drawing from "./Drawing.js";
import MouseTracker from "./MouseTracker.js";
import Level from "./Level.js";
import BaseObject from "./objects/BaseObject.js";
import Enemy from "./Enemy.js";

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