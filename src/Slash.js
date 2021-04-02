const { EventEmitter } = require("events");
const { resolve } = require("path");
const BaseCommand = require("./BaseCommand");

class Slash extends EventEmitter {
    constructor(options) {
        super(options);
        this.client = options.client;
        this.axios = require("axios");
        
        if (!this.client) throw new Error("[ERROR Client was not provided!")
        if (typeof this.client !== "object") throw new Error(`[ERROR] Expected client to be an object, received ${typeof this.client}`);
        
        this.client.on("raw", async (event) => {
            if (event.t === "INTERACTION_CREATE") {
            this.emit("command", (new BaseCommand(event.d, this.client)))
            }
        })
    }
    
    create(options) {
        let url = `https://discord.com/api/v8/applications/${this.client.user.id}/commands`;
        
        if (!options.data) throw new Error("[ERROR] Data for the command was not provided");

        if (options.guildOnly === true && !options.guildID) throw new Error("[ERROR] Command was guild-only, but guild ID was not provided.")
        if (options.guildOnly === true && isNaN(options.guildID)) throw new Error("[ERROR] Guild ID is invalid.")        

        if (options.guildOnly === true) url = `https://discord.com/api/v8/applications/${this.client.user.id}/guilds/${options.guildID}/commands`;
        
        if (!options.data.name) throw new Error("[ERROR] Command name wasn't provided.");

        let cmd = {
            name: options.data.name,
            description: options.data.description,
            options: options.data.options || []
        };

        let config = {
            method: "POST",
            headers: {
                Authorization: `Bot ${this.client.token}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(cmd), 
            url,
        }

        this.axios(config)
        .then((response) => {
            this.emit("create", response)
        })
        .catch((err) => {
            console.log(`[ERROR] Request failed\n${err}`);
        }) 
    }

    delete(options) {
        if (!options.commandID) throw new Error(`[ERROR] Command ID was not provided.`);
        if (isNaN(options.commandID)) throw new Error(`[ERROR] ID must be a number, received ${typeof options.commandID}`);

        let url = `https://discord.com/api/v8/applications/${this.client.user.id}/${options.guildID ? `guilds/${options.guildID}/` : "" }commands/${options.commandID}`;

        this.axios({
            method: "delete",
            url,
            headers: {
                Authorization: `Bot ${this.client.token}`
            },
        })
        .catch((err) => {
            console.log(`[ERROR] Request failed\n${err}`);
        });
        this.emit("delete", this)
        return this;
    }

    edit(options) {
        //todo
    }

    all(options) {
        return new Promise((resolve, reject) => {
            let url = `https://discord.com/api/v8/applications/${this.client.user.id}/commands`
            if (options.guildID) url = `https://discord.com/api/v8/applications/${this.client.user.id}/guilds/${options.guildID}/commands`
            this.axios
                .get(
                    url,
                    {
                        headers: {
                            Authorization: "Bot " + this.client.token,
                        },
                    }
                )
                .then((res) => resolve(res.data))
                .catch((e) => reject(e));
        });
    }

    get(options) {
        return new Promise((resolve, reject) => {
            let url = `https://discord.com/api/v8/applications/${this.client.user.id}/commands/${options.commandID}`
        })
    }

    find(options) {
        //todo
    }
}

module.exports = Slash;
