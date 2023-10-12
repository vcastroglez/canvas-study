import g from "./globals.js";

const routes = {
	you: (data) => {
		g().player.id = data;
	},
	'enemies': (data) => {
		g().enemies.enemies = data;
	},
}

export default function resolve(payload) {
	const action = payload.action || payload.route;
	const data = payload.data;
	try {
		routes[action](data);
	}catch (e) {
		console.log(action+' is not a valid route');
	}
}