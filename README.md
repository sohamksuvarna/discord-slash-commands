# discord-slash-commands
## Slash commands for Discord

## Installation
```sh
npm i discord-slash-commands
```

## Features
- Customizable
- Multiple commands support
- Per-guild commands support

### Example
```js
const Discord = require('discord.js');
const client = new Discord.Client();

const { Slash } = require('discord-slash-commands');
const slash = new Slash(client);

client.on("ready", () => {
    console.log("Ready");
    slash.command({
        guildOnly: true,
        guildID: "GUILD_ID",
        data: {
            name: "ping",
            description: "Ping pong?",
            type: 4,
            content: `Pong! \`${client.ws.ping}ms\``
        }
    })
})

client.login("TOKEN");
```

## Need help? Join the [Support Server](https://discord.gg/mKyRmPB)

### © shadeoxide | Shade's Workshop - 2020