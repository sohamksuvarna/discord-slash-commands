class Slash {
    constructor(client) {
    this.axios = require('axios')
    this.client = client
    this.client.token = client.token
    }
    command(options) {
        let url = `https://discord.com/api/v8/applications/${this.client.user.id}/commands`
        if (!options.data) return console.log("[ERROR]: Data for command wasn't provided") 
        if (options.guildOnly === true && !options.guildID) return console.log("[ERROR] Command was guild only, but no guild ID provided") 
        if (options.guildOnly === true) url = `https://discord.com/api/v8/applications/${this.client.user.id}/guilds/${options.guildID}/commands`
        if (!options.data.name) return console.log("[ERROR] Command name wasn't provided")
        if (!options.data.content) return console.log("[ERROR] No content was provided")
        let cmd = {
            "name": options.data.name,
            "description": options.data.description || "No description provided",
            "options": options.data.options || []
        }
        let config = {
            method: 'POST',
            headers: {
                "Authorization": `Bot ${this.client.token}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(cmd),
            url
        }
        
        this.axios(config).then(function(response) {
            console.log(`[SUCCESS] Command created`);
        }).catch(function(err) {
        console.log(`[ERROR] Request failed\n${err}`);
        });

        this.client.on("raw", async event => {
            if (event.t === "INTERACTION_CREATE") {
            let commandName = event.d.data.name;
            if (commandName === options.data.name) return (await this.client.api.interactions(event.d.id)[event.d.token].callback.post({
            data: {
            type: options.data.type || 4,
            data: {
            content: options.data.content
            }
            }
            }));
            }
        });            
    }
}

module.exports = Slash;