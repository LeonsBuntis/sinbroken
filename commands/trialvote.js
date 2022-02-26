const config = require("../config.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("trialvote")
    .setDescription("Create a vote channel for the trial given by <name>")
    .addStringOption((option) =>
      option.setName("name").setDescription("The ingame name of the trial")
    ),
  async execute(interaction) {
    if (!interaction.isCommand()) return;
    const { options, guild, member } = interaction;

    if (!member.roles.cache.has(config.gm_role_id)) {
      return await interaction.reply({
        content: "Insufficient permisison, dickbreaker",
        ephemeral: true,
      });
    }

    if (!options) {
      return await interaction.reply({
        content: "Something went wrong with the options",
        ephemeral: true,
      });
    }

    const name = options.getString("name");
    const channelName = `vote-${name}`;

    if (!name)
      return await interaction.reply({
        content: "Please input the players main character name.",
        ephemeral: true,
      });

    // Create the new channel under category VOTE ( config.activeVotesCategory )
    await guild.channels
      .fetch(config.activeVotesCategory)
      .then((category) => {
        category
          .createChannel(channelName, {
            type: "GUILD_TEXT",
            topic: `Vote for ${name}!`,
          })
          .then((channel) => {
            channel.send(
              `**VOTE: ${name}**\n\n:white_check_mark: - You see this trial as someone who fits our core team.\n\n:clock1: - You think we need some more time to see how it goes and how the performance changes.\n:x: - This trial is someone you don't think ever will fit us.\n\n`
            );

            let button1 = new MessageButton();
            button1.setCustomId("trial-accept");
            button1.setLabel("Accept");
            button1.setStyle(3);

            let button2 = new MessageButton();
            button2.setCustomId("trial-extend");
            button2.setLabel("Extend Trial");
            button2.setStyle(2);

            let button3 = new MessageButton();
            button3.setCustomId("trial-reject");
            button3.setLabel("Reject");
            button3.setStyle(4);

            const row = new MessageActionRow().addComponents([
              button1,
              button2,
              button3,
            ]);

            channel.send({
              components: [row],
              content: "\nACCEPT:\nEXTEND:\nREJECT:\n",
            });

            // Reply
            interaction.reply(`Started ${channel} for ${name}!`);
          });
      })
      .catch(console.error);
  },
};
