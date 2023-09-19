import g from "./Globals.js";

export default class {
    inclination_speed = 5;
    max_inclination = 3;
    keys = [];
    position = {}

    trackPlayer() {
        addEventListener('mousemove', (event) => {
            this.position.x = event.clientX;
            this.position.y = event.clientY;
        })

        addEventListener('click', (event) => {
            g().player.weapon.fire();
        });

        addEventListener('keydown', (event) => {
            const key = event.key.toLowerCase();
            if(['a','s','d','w'].indexOf(key)===-1) return;
            this.addKey(key);
        });
        addEventListener('keyup', (event) => {
            this.inclination_speed = 5;
            const key = event.key.toLowerCase();
            this.removeKey(key)
        })
    }

    removeKey(key) {
        const index = this.getKeyIndex(key);
        if (index!==false) {
            this.keys.splice(index, 1);
        }
    }

    addKey(key){
        if(!this.isKeyPressed(key)) this.keys.push(key);
    }

    isKeyPressed(key){
        return this.getKeyIndex(key) !== false;
    }
    getKeyIndex(key) {
        const index = this.keys.indexOf(key);
        return index > -1 ? index : false;
    }
}