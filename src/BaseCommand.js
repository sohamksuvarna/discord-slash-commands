class BaseCommand {
    constructor(d, client) {
        this.client = client
        this.name = d.data.name;
        this.id = d.id;
        this.token = d.token
        this.type = d.type
        this.options = d.data.options
        this.author = d.member.user
        this.member = d.member
        this.guild = client.guilds.cache.get(d.guild_id)
        this.channel = client.channels.cache.get(d.channel_id)
    }
    async callback(content, options) { 
        let flags = 0;
        if (typeof content === "object") {
            options = content;
            content = null;
        }
        if (!options) options = {}
        if (options.ephemeral === true) flags = 1 << 6
        let em;
        if (typeof options.embeds === "array") em = options.embeds;
        if (typeof options.embeds === "object") em = [options.embeds]
        return await this.client.api
        .interactions(this.id)
        [this.token].callback.post({
          data: {
              type: options.type || 4,
              data: {
                  content: content,
                  embeds: em || null,
                  flags: flags 
              }
          }  
        })
    }
}

module.exports = BaseCommand;