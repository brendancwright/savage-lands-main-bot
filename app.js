const Discord = require("discord.js");
const request = require('request');

const apiUrl = "https://api.battlemetrics.com/servers/3801726";

const updateInterval = (1000 * 60) * 3;

const client = new Discord.Client();

function updateActivity() {
    // require("tls").DEFAULT_ECDH_CURVE = "auto"
    request({ url: apiUrl, headers: { json: true, Referer: 'discord-rustserverstatus' }, timeout: 10000 }, function (err, res, body) {
        if (!err) {
            const jsonData = JSON.parse(body);
            const server = jsonData.data.attributes;
            const is_online = server.status;
            if (is_online == "online") {
                const players = server.players;
                const maxplayers = server.maxPlayers;
                const queuedPlayers = server.details.rust_queued_players;
                if (players >= maxplayers) {
                    return client.user.setActivity(`${players}/${maxplayers} (${queuedPlayers})`)
                }
                return client.user.setActivity(`${players}/${maxplayers}`);
            } else {
                return client.user.setActivity("Offline");
            }
        }
    });
}

client.on("ready", () => {
    updateActivity();
    setInterval(function () {
        updateActivity();
    }, updateInterval);
});

client.login(process.env.TOKEN);