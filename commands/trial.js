const config = require('../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('trial')
    .setDescription('Create text channel called trial-<name>, add <discordid> and officers to it.')
    .addStringOption(option => option.setName('name').setDescription('The Trial\'s ingame name.'))
    .addUserOption(option => option.setName('discordname').setDescription('The Trial\'s discord username.')),
    //.addRoleOption(option => option.setName('assigned_role').setDescription('The trial')) //TODO: Create a flag for if trial is another realm.
    async execute(interaction) {
      if (!interaction.isCommand()) return;
      const { options, guild } = interaction;

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
            // TODO: add trial to channel
            category.createChannel(channelName, {
              type: 'GUILD_TEXT',
              topic: `Questions regarding ${name}'s trial.`
            }).then(channel => {
              channel.send(`Welcome to Sinbreakers ${name} (${user}). We have now created and marked you as a trial. Please make sure to read up on the raid-info channel.`);
            });
          }).catch(console.error);

        // TODO: implement the check for outside realm or not
        // Add trial or trial (outside realm) based on what realm the trial is from.
        const member = options.getMember('discordname');
        await member.roles.add(config.trial_id);

        // TODO: Change user nickname to ingame name.
        // Set nickname of the trial
        await member.setNickname(name);

        // Reply
        await interaction.reply(`Created new trial channel for ${user}(${name})`);
    }
};



	// if (!interaction.isCommand()) return;
	// const { commandName, options, guild } = interaction;

	// if (commandName === 'trial') {
	// 	if (!options) {
	// 		await interaction.reply('Something went wrong with the options');
	// 		return;
	// 	}
	// 	const name = options.getString('name');
	// 	const user = options.getUser('discordname');
	// 	const channelName = 'trial-' + name;

	// 	if (!user) return await interaction.reply("Please input a discord username.");

	// 	// create the new channel under category TRIALS ( config.trialChannelCategory )
	// 	await guild.channels.fetch(config.trialChannelCategory)
	// 		.then(category => {

	// 			//TODO: add trial and officers to the channel
	// 			// Create channel and add permissions for officers and the trial
	// 			category.createChannel(channelName, {
	// 				type: 'GUILD_TEXT',
	// 				topic: `Questions regarding ${name}'s trial.`
	// 			}).then(channel => {
	// 				//console.log(channel);
	// 				channel.send(`Welcome to Sinbreakers ${name} (${user}). We have now created and marked you as a trial. Please make sure to read up on the raid-info channel.`);
	// 			});
	// 		}).catch(console.error);

		// add discordname to channel permission overwrites

		// TODO: implement the check for outside realm or not
		// Add trial or trial (outside realm) based on what realm the trial is from.
		//const member = options.getMember('discordname');
		//await member.roles.add(config.trial_id);

		// TODO: Change user nickname to ingame name.
		// Set nickname of the trial
		//await member.setNickname(name);

	// 	// Reply
	// 	await interaction.reply(`Created new trial channel for ${user}(${name})`);
	// } else if (commandName === 'trialvote') {
	// 	await interaction.reply('not implemented')
	// }

        // const rest = new REST({ version: '9' }).setToken(token);
        // const commands = [
        //     new SlashCommandBuilder()
        //         .setName('trial')
        //         .setDescription('Create text channel called trial-<name>, add <discordid> and officers to it.')
        //         .addStringOption(option => option.setName('name').setDescription('The Trial\'s ingame name.'))
        //         .addUserOption(option => option.setName('discordname').setDescription('The Trial\'s discord username.'))
        //         //.addRoleOption(option => option.setName('assigned_role').setDescription('The trial')) //TODO: Create a flag for if trial is another realm.
        //         ,
        //     new SlashCommandBuilder()
        //         .setName('trialvote')
        //         .setDescription('Create a vote channel for the trial given by <name>')
        //         .addStringOption(option => option.setName('name').setDescription('The ingame name of the trial'))
        // ].map(command => command.toJSON());
        // rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
        //     .then(() => console.log('Successfully registered application commands.'))
        //     .catch(console.error);
