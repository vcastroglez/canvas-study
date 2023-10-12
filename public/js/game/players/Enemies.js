import g from "../../conf/globals.js";

export default class {

	enemies = [];

	constructor() {
	}

	draw(){
		this.enemies.forEach((enemy)=>{
			this.drawEnemy(enemy);
		})
	}

	inBound(x,y){

	}

	drawEnemy(enemy) {
		if(!enemy || !enemy.position) return;
		g().drawing.drawCircle(enemy.position.x, enemy.position.y, enemy.info.size, 'red');
	}
}