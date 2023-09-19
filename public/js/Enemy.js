import globals, {canvas} from "./Globals.js";

export default class {
    position = {
        x: 222,
        y: 333
    }

    id = null;

    shape = 'circle'
    size = 20

    getPosition() {
        return this.position;
    }

    draw(){
        globals().drawing.drawCircle(this.position.x,this.position.y,10,'green');
    }

    setPosition({x,y}){
        this.position.x = x;
        this.position.y = y;
        this.draw();
    }
}