import g from "./globals.js";

const routes = {
    you: (data) => {
        g().player.id = data;
    },
    enemy: (data) => {
        g().enemy.id = data.player;
        g().enemy.setPosition(data.position?.x,data.position?.y);
        setInterval(() => {
            g().server.send(JSON.stringify({'action': 'update-enemy', 'id': data.player}));
        }, 25)
    },
    'update-enemy': (data) => {
        g().enemy.id = data.player;
        g().enemy.setPosition(data.position?.x,data.position?.y);
    },
    'no-enemy': () => {
        setTimeout(() => {
            g().server.send(JSON.stringify({'action': 'get-enemy'}));
        }, 3000);
        console.log("no enemy found, retrying in 3 seconds");
    }
}

export default function resolve(payload){
    const action = payload.action;
    const data = payload.data;
    routes[action](data);
}