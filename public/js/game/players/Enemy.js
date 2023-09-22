import globals, {canvas} from "../../conf/globals.js";

export default class {
    position = {
        x: -100,
        y: -100
    }

    id = null;

    shape = 'circle'
    size = 20

    getPosition() {
        return this.position;
    }

    draw(){
        globals().drawing.drawCircle(this.position.x,this.position.y,20,'red');
    }

    setPosition(x,y){
        this.position.x = x;
        this.position.y = y;
    }
}