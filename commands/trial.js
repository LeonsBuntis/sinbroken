const config = require('../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('trial')
    .setDescription('Create text channel called trial-<name>, add <discordid> and officers to it.')
    .addStringOption(option => option.setName('name').setDescription('The Trial\'s ingame name.'))
    .addUserOption(option => option.setName('discordname').setDescription('The Trial\'s discord username.'))
    .addBooleanOption(option => option.setName('outside').setDescription('Whether the trial is on the same realm or not.')),
    //.addRoleOption(option => option.setName('assigned_role').setDescription('The trial')), //TODO: Create a flag for if trial is another realm.
    async execute(interaction) {
      if (!interaction.isCommand()) return;
      const { options, guild } = interaction;

      if (!options) {
        await interaction.reply('Something went wrong with the options');
        return;
      }

      const name = options.getString('name');
      const user = options.getMember('discordname');
      const outsideRealm = options.getBoolean('outside');
      //const role = options.getRole('assigned_role');
      const channelName = 'trial-' + name;

      if (!name) return await interaction.reply("Please input the trial's ingame name.");
      if (!user) return await interaction.reply("Please input a discord username.");

      // create the new channel under category TRIALS ( config.trialChannelCategory )
      await guild.channels.fetch(config.trialChannelCategory).then(category => {
          // TODO: add trial to channel
          category.createChannel(channelName, {
            type: 'GUILD_TEXT',
            topic: `Questions regarding ${name}'s trial.`
          }).then(channel => {
            channel.send(`Welcome to Sinbreakers ${name} (${user}). We have now created and marked you as a trial. Please make sure to read up on the raid-info channel.`);
          });
      }).catch(console.error);

      // Add trial or trial (outside realm) based on what realm the trial is from.
      await outsideRealm ? user.roles.add(config.trial_id_outside) : user.roles.add(config.trial_id);

      // Set nickname of the trial
      await user.setNickname(name);

      // Reply
      await interaction.reply(`Created new trial channel for ${user}(${name})`);
    }
};
