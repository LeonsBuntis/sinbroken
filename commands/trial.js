const config = require("../config.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("trial")
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
    const channelName = "trial-" + name;

    if (!user)
      return await interaction.reply("Please input a discord username.");

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
              `Welcome to Sinbreakers ${name} (${user}). We have now created and marked you as a trial. Please make sure to read up on the raid-info channel.`
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
