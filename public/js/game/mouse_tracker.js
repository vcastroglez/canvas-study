import g from "../conf/globals.js";
import Circle from "./objects/circle.js";

export default class {
	inclination_speed = 5;
	keys = [];
	touchs = [];
	position = {};
	isMobile = false;
	touch_left_start = null;
	touch_left_drag = null;
	touch_right_drag = null;

	constructor() {
		this.isMobile = this.detectMobile();
		if (!this.isMobile) {
			this.initKeyboardEvents();
		} else {
			this.initTouchEvents();
		}
	}

	initTouchEvents() {
		addEventListener('touchstart', (event) => {
			event.preventDefault();
			event.stopImmediatePropagation();
			const touchList = event.changedTouches;
			for (let i = 0; i < touchList.length; i++) {
				const touch = touchList[i];
				const x = touch.clientX;
				const y = touch.clientY;
				if (x < (window.visualViewport.width / 2)) {
					this.touch_left_start = {x, y};
					g().level.bosonObjects.push(new Circle(x, y, touch.radiusX * 1.1, 'black'));
				} else {
					this.touch_right_start = {x, y};
					g().level.bosonObjects.push(new Circle(x, y, touch.radiusX * 1.1, 'blue'));
				}
			}
		}, {passive: false});

		addEventListener('touchmove', (event) => {
			const touchList = event.changedTouches;
			for (let i = 0; i < touchList.length; i++) {
				const touch = touchList[i];
				const x = touch.clientX;
				const y = touch.clientY;
				if (x < (window.visualViewport.width / 2)) {
					this.touch_left_drag = {x, y};
				} else {
					this.touch_right_drag = {x, y};
				}
				this.calculateAngles();
			}
		})

		addEventListener('touchend', (event) => {
			this.cancelTouches(event);
		})

		addEventListener('touchcancel', (event) => {
			this.cancelTouches(event);
		})
	}

	calculateAngles() {
		let angle_left = null;
		let angle_right = null;
		if (this.touch_left_start) {
			angle_left = g().getAngle(this.touch_left_start.x, this.touch_left_start.y, this.touch_left_drag.x, this.touch_left_drag.y);
			this.activateClosestKeys(angle_left);
		}
		if (this.touch_right_start) {
			angle_right = g().getAngle(this.touch_right_start.x, this.touch_right_start.y, this.touch_right_drag.x, this.touch_right_drag.y);
			let event = new CustomEvent("player-shooting", {detail: {angle: angle_right}});
			document.getElementById('mainCanvas').dispatchEvent(event);
		}
	}

	activateClosestKeys(angle) {
		const top = -(Math.PI * 0.5);
		const top_right = -(Math.PI * 0.25)
		const righ = 0
		const righ_down = Math.PI * 0.25;
		const down = Math.PI * 0.5;
		const down_left = Math.PI * 0.75;
		const left = Math.PI;
		const top_left = -(Math.PI * 0.75);
		let min = 99;
		let min_keys = null;
		if (Math.abs(top - angle) < min) {
			min_keys = 't';
			min = Math.abs(top - angle);
		}
		if (Math.abs(top_right - angle) < min) {
			min_keys = 'tr'
			min = Math.abs(top_right - angle);
		}
		// console.log(top_right - angle);
		if (Math.abs(righ - angle) < min) {
			min_keys = 'r';
			min = Math.abs(righ - angle);
		}
		// console.log(righ - angle);
		if (Math.abs(righ_down - angle) < min) {
			min_keys = 'rd';
			min = Math.abs(righ_down - angle);
		}
		// console.log(righ_down - angle);
		if (Math.abs(down - angle) < min) {
			min_keys = 'd';
			min = Math.abs(down - angle);
		}
		// console.log(down - angle);
		if (Math.abs(down_left - angle) < min) {
			min_keys = 'dl';
			min = Math.abs(down_left - angle);
		}
		if (Math.abs(left - angle) < min) {
			min_keys = 'l';
			min = Math.abs(left - angle);
		}
		if (Math.abs(top_left - angle) < min) {
			min_keys = 'tl';
		}
		// console.log(left - angle);
		switch (min_keys) {
			case 't':
				this.keys = ['w'];
				break;
			case 'tr':
				this.keys = ['w', 'd'];
				break;
			case 'r':
				this.keys = ['d'];
				break;
			case 'rd':
				this.keys = ['d', 's'];
				break;
			case 'd':
				this.keys = ['s'];
				break;
			case 'dl':
				this.keys = ['s', 'a'];
				break;
			case 'l':
				this.keys = ['a'];
				break;
			case 'tl':
				this.keys = ['a', 'w'];
				break;
		}
	}

	cancelTouches(event) {
		const touchList = event.changedTouches;
		for (let i = 0; i < touchList.length; i++) {
			const touch = touchList[i];
			const x = touch.clientX;
			const y = touch.clientY;
			if (x < (window.visualViewport.width / 2)) {
				this.touch_left_start = {};
				this.touch_left_drag = {};
				g().level.bosonObjects = [];
				this.keys = [];
			} else {
				this.touch_right_start = {};
				this.touch_right_drag = {};
				g().level.bosonObjects = [];
				g().level.bosonObjects = [];
				let event = new CustomEvent("player-not-shooting");
				document.getElementById('mainCanvas').dispatchEvent(event);
			}

		}
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