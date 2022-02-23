const trialTemplate = require("../assets/trial-template.js");
const config = require("../config.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("trialcreate")
    .setDescription(
      "Create text channel called trial-<name>, add <discordid> and officers to it."
    )
    .addStringOption((option) =>
      option.setName("name").setDescription("The Trial's ingame name.")
    )
    .addUserOption((option) =>
      option
        .setName("discordname")
        .setDescription("The Trial's discord username.")
    )
    .addStringOption((option) =>
      option.setName("class").setDescription("The Trial's class.")
    ),

  async execute(interaction) {
    if (!interaction.isCommand()) return;
    const { options, guild } = interaction;

    if (!options) {
      await interaction.reply("Something went wrong with the options");
      return;
    }

    const name = options.getString("name");
    const user = options.getUser("discordname");
    const pClass = options.getString("class");
    const channelName = `${name}-${pClass}`;

    if (!user)
      return await interaction.reply("Please input a discord username.");

    if (!name)
      return await interaction.reply(
        "Please input the players main character name."
      );

    // Create the new channel under category TRIALS ( config.trialChannelCategory )
    await guild.channels
      .fetch(config.trialChannelCategory)
      .then((category) => {
        category
          .createChannel(channelName, {
            type: "GUILD_TEXT",
            topic: `Questions regarding ${name}'s trial.`,
          })
          .then((channel) => {
            channel.permissionOverwrites.create(user, {
              VIEW_CHANNEL: true,
              SEND_MESSAGES: true,
            });

            channel.send(
              trialTemplate.getWelcomeTemplate(user, guild.channels)
            );

            // Add trial or trial (outside realm) based on what realm the trial is from.
            const member = options.getMember("discordname");
            member.roles.add(config.trial_id);

            // Set nickname of the trial
            member.setNickname(name);

            // Reply
            interaction.reply(
              `Created new trial channel for ${user}(${name}) @ ${channel}`
            );
          });
      })
      .catch(console.error);
  },
};
