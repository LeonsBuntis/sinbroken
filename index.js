// Require the necessary discord.js classes
const { Client, Intents, Collection, GuildStickerManager, Permissions, CategoryChannel } = require('discord.js');
const config = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName, options, guild } = interaction;

	if (commandName === 'trial') {
		if (!options) {
			await interaction.reply('Something went wrong with the options');
			return;
		}
		const name = options.getString('name');
		const user = options.getUser('discordname');
		const channelName = 'trial-' + name;

		if (!user) return await interaction.reply("Please input a discord username.");

		// create the new channel under category TRIALS ( config.trialChannelCategory )
		await guild.channels.fetch(config.trialChannelCategory)
			.then(category => {

				//TODO: add trial and officers to the channel
				// Create channel and add permissions for officers and the trial
				category.createChannel(channelName, {
					type: 'GUILD_TEXT',
					topic: `Questions regarding ${name}'s trial.`
				}).then(channel => {
					//console.log(channel);
					channel.send(`Welcome to Sinbreakers ${name} (${user}). We have now created and marked you as a trial. Please make sure to read up on the raid-info channel.`);
				});
			}).catch(console.error);

		// add discordname to channel permission overwrites

		// TODO: implement the check for outside realm or not
		// Add trial or trial (outside realm) based on what realm the trial is from.
		//const member = options.getMember('discordname');
		//await member.roles.add(config.trial_id);

		// TODO: Change user nickname to ingame name.
		// Set nickname of the trial
		//await member.setNickname(name);

		// Reply
		await interaction.reply(`Created new trial channel for ${user}(${name})`);
	} else if (commandName === 'trialvote') {
		await interaction.reply('not implemented')
	}
})

// Login to Discord with your client's token
client.login(config.token);
