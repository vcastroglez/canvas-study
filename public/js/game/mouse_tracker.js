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
					g().level.bosonObjects.push(new Circle(x, y, 10, 'black'));
				} else {
					this.touch_right_start = {x, y};
					g().level.bosonObjects.push(new Circle(x, y, 10, 'blue'));
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
					g().level.bosonObjects.push(new Circle(x, y, 10, 'black'));
				} else {
					this.touch_right_drag = {x, y};
					g().level.bosonObjects.push(new Circle(x, y, 10, 'blue'));
				}

			}
		})

		addEventListener('touchend', (event) => {
			this.cancelTouches(event);
		})

		addEventListener('touchcancel', (event) => {
			this.cancelTouches(event);
		})
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
			} else {
				this.touch_right_start = {};
				this.touch_right_drag = {};
				g().level.bosonObjects = [];
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