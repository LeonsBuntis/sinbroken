/*
* Application
*/
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../config.json');
const { Collection } = require('discord.js');

// Functions
module.exports = {
    registerCommands: (client) => {
        const commands = [];
        client.commands = new Collection();

        // Get all command files through the commands directory
        const commandFiles = fs.readdirSync('./commands')
            .filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            commands.push(command.data.toJSON());
            client.commands.set(command.data.name, command);
        }

        // Register the commands.
        const rest = new REST({
            version: '9'
        }).setToken(token);
        (async () => {
            try {
                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId), {
                        body: commands
                    },
                );
                console.log('[+] Successfully registered application commands');
            } catch (error) {
                if (error) console.error(error);
            }
        })();
    },
    // idk yet
    wip: () => {
    }
};
