const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
          .setName('trialvote')
          .setDescription('Create a vote channel for the trial given by <name>')
          .addStringOption(option => option.setName('name').setDescription('The ingame name of the trial')),
    async execute(interaction) {
        await interaction.reply('Not implemented');
    }
};
