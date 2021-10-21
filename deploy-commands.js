const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');


const commands = [
	new SlashCommandBuilder()
		.setName('trial')
		.setDescription('Create text channel called trial-<name>, add <discordid> and officers to it.')
		.addStringOption(option => option.setName('name').setDescription('The Trial\'s ingame name.'))
		.addUserOption(option => option.setName('discordname').setDescription('The Trial\'s discord username.'))
		//.addRoleOption(option => option.setName('assigned_role').setDescription('The trial')) //TODO: Create a flag for if trial is another realm.
		,
	new SlashCommandBuilder()
		.setName('trialvote')
		.setDescription('Create a vote channel for the trial given by <name>')
		.addStringOption(option => option.setName('name').setDescription('The ingame name of the trial'))


].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
