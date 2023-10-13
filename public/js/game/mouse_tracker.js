import g from "../conf/globals.js";

export default class {
	inclination_speed = 5;
	keys = [];
	touchs = [];
	position = {};
	isMobile = false;

	constructor() {
		this.isMobile = this.detectMobile();
		if(!this.isMobile) {
			this.initKeyboardEvents();
		}else{
			this.initTouchEvents();
		}
	}

	initTouchEvents(){
		addEventListener('touchstart',(event)=>{
			this.touchs[even.which] = 1;//continue here
		})
	}

	detectMobile() {
		const toMatch = [
			/Android/i,
			/webOS/i,
			/iPhone/i,
			/iPad/i,
			/iPod/i,
			/BlackBerry/i,
			/Windows Phone/i
		];

		return toMatch.some((toMatchItem) => {
			return navigator.userAgent.match(toMatchItem);
		});
	}

	removeKey(key) {
		const index = this.getKeyIndex(key);
		if (index !== false) {
			this.keys.splice(index, 1);
		}
	}

	addKey(key) {
		if (!this.isKeyPressed(key)) this.keys.push(key);
	}

	isKeyPressed(key) {
		return this.getKeyIndex(key) !== false;
	}

	getKeyIndex(key) {
		const index = this.keys.indexOf(key);
		return index > -1 ? index : false;
	}

	initKeyboardEvents() {
		addEventListener('mousemove', (event) => {
			this.position.x = event.clientX;
			this.position.y = event.clientY;
		})

		addEventListener('click', () => {
			g().player.weapon.fire();
		});

		addEventListener('keydown', (event) => {
			const key = event.key.toLowerCase();
			if (['a', 's', 'd', 'w'].indexOf(key) === -1) return;
			this.addKey(key);
		});
		addEventListener('keyup', (event) => {
			this.inclination_speed = 5;
			const key = event.key.toLowerCase();
			this.removeKey(key)
		})
	}
}