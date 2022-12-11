module.exports = class Command {
    constructor (name, category) {
        // Gateway stuff
        this.name = name,
        this.description = "No description provided.",
        this.options = [],
        this.permissions = {
            DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
        }
        this.dm_permission = false,
        // Extra stuff Woomy uses internally 
        this.category = category,
        this.usage = "No usage information provided.",
        this.friendlyOptions = "No options provided."
        this.enabled = true,
        this.devOnly = false,
        this.cooldown = 2000
    }

    run (client, interaction, data) { //eslint-disable-line no-unused-vars
        
    }
};