import g from "./conf/globals.js";
import globals from "./conf/globals.js";
import bootstrap, {checkForName} from "./game/bootstrap.js";
import resolve from "./conf/ws-router.js";

checkForName().then(r => {
	if (!r) {
		alert("Wrong PIN provided :(, remove your local storage to create new user");
		throw new Error("Wrong PIN");
	}

	bootstrap()

	window.global = function () {
		return globals();
	}
	window.router = function (route) {
		return resolve(route);
	}
// Connection opened
	g().server.addEventListener("open", (event) => {
		g().server_connected = true;
	});
	g().server.addEventListener("close", (event) => {
		g().server_connected = false;
	});

// Listen for messages
	g().server.addEventListener("message", (event) => {
		const data = JSON.parse(event.data);
		console.log(`Message received: ${data.route}`);
		resolve(data);
	});
});
