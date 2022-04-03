const { SlashCommandBuilder } = require("@discordjs/builders");
const music = require("@koenie06/discord.js-music");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("Music bot commands")
    .addSubcommand((subCommand) =>
      subCommand
        .setName("play")
        .setDescription("Start a song by title")
        .addStringOption((option) =>
          option.setName("title").setDescription("The song title")
        )
    )
    .addSubcommand((subCommand) =>
      subCommand.setName("stop").setDescription("Stop playing")
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("repeat")
        .setDescription(
          "Use 'true' to set the song on repeat.\nUse 'false' to turn the repeat mode off when it is on."
        )
        .addBooleanOption((option) =>
          option.setName("onoroff").setDescription("On or Off")
        )
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("volume")
        .setDescription("Volume can't be higher than 100")
        .addIntegerOption((option) =>
          option.setName("percent").setDescription("percent")
        )
    )
    .addSubcommand((subCommand) =>
      subCommand.setName("queue").setDescription("Retrieve the queue")
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("removefromqueue")
        .setDescription(
          "Number option needs to be an Integer and has to be a valid queue number."
        )
        .addIntegerOption((option) =>
          option.setName("queuenumber").setDescription("queueNumber")
        )
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("skip")
        .setDescription("Skip the current playing music")
    ),
  async execute(interaction) {
    if (!interaction.isCommand()) return;
    const { options, member } = interaction;
    switch (interaction.options.getSubcommand()) {
      case "play":
        if (!options) {
          return interaction.reply({
            content: "Something went wrong with the options",
            ephemeral: true,
          });
        }
        return this.playCommand(interaction, member, options);
      case "stop":
        return this.stopCommand(interaction);
      case "skip":
        return this.skipCommand(interaction);
      case "repeat":
        return this.repeatCommand(interaction.options);
      case "volume":
        return this.volumeCommand(interaction, options);
      case "queue":
        return this.queueCommand(interaction);
      case "removefromqueue":
        return this.removeFromQueueCommand(interaction, options);
      default:
        return interaction.reply({
          content: "invalid or non-existent command",
          ephemeral: true,
        });
    }
  },
  async playCommand(interaction, member, options) {
    if (!member.voice.channel) {
      return await interaction.reply({
        content: "You must be in a voice channel to use this command",
        ephemeral: true,
      });
    }
    const title = options.getString("title");

    if (!title)
      return await interaction.reply({
        content: "Please enter a song title!",
        ephemeral: true,
      });

    music.play({
      interaction: interaction,
      channel: member.voice.channel,
      song: title,
    });

    interaction.reply(`Playing!`);
  },
  async stopCommand(interaction) {
    music.stop({
      interaction: interaction,
    });

    interaction.reply(`Stopping!`);
  },
  async skipCommand(interaction) {
    music.skip({
      interaction: interaction,
    });

    interaction.reply(`Skipping to next!`);
  },
  async repeatCommand(interaction, options) {
    const onOrOff = options.getBoolean("onoroff");

    if (!onOrOff)
      return await interaction.reply({
        content:
          "Use 'true' to set the song on repeat.\nUse 'false' to turn the repeat mode off when it is on.",
        ephemeral: true,
      });

    music.repeat({
      interaction: interaction,
      value: onOrOff,
    });

    interaction.reply(`Repeat: ` + onOrOff);
  },
  async volumeCommand(interaction, options) {
    const percent = options.getInteger("percent");

    if (!percent || percent > 100 || percent < 0)
      return await interaction.reply({
        content: "Volume can't be higher than 100 and lower than 0",
        ephemeral: true,
      });

    music.volume({
      interaction: interaction,
      volume: percent,
    });

    interaction.reply(`New volume: ${percent}% / 100%`);
  },
  async queueCommand(interaction) {
    const songs = await music.getQueue({ interaction: interaction });
    const queue = [];

    Object.values(songs).forEach((song) => {
      queue.push({
        name: "#" + songs.indexOf(song),
        value: song.info.title,
        inline: true,
      });
    });

    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Music queue")
      .setThumbnail("https://i.imgur.com/FMdoCTp.png")
      .addFields(queue);

    await interaction.reply({ embeds: [embed] });
  },
  async removeFromQueueCommand(interaction, options) {
    const number = options.getInteger("queuenumber");

    if (!number)
      return await interaction.reply({
        content:
          "Number option needs to be an Integer and has to be a valid queue number.",
        ephemeral: true,
      });

    music.removeQueue({
      interaction: interaction,
      number: number,
    });

    interaction.reply(`Removed #${number} from queue`);
  },
};
