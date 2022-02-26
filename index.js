/*
 * Bootstrap the bot application.
 */
const { Client, Intents } = require("discord.js");
const config = require("./config.json");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const app = require("./core/app.js");

client.once("ready", () => {
  app.registerCommands(client);
  app._scheduler_start(client);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    if (error) console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.on("interactionCreate", async (button) => {
  if (!button.isButton()) return;

  let oldMsg = button.message.content;
  if (button.message.content.includes(`${button.member.displayName}`)) {
    oldMsg = button.message.content.replace(`${button.member.displayName}`, "");
  }

  switch (button.customId) {
    case "trial-accept":
      button.message.edit(
        oldMsg.replace("ACCEPT:", `ACCEPT: ${button.member.displayName} `)
      );
      return button.deferUpdate();
    case "trial-extend":
      button.message.edit(
        oldMsg.replace("EXTEND:", `EXTEND: ${button.member.displayName} `)
      );
      return button.deferUpdate();
    case "trial-reject":
      button.message.edit(
        oldMsg.replace("REJECT:", `REJECT: ${button.member.displayName} `)
      );
      return button.deferUpdate();

    default:
      return button.deferUpdate();
  }
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return false;
  if (Math.floor(Math.random() * 30) + 1 === 1) {
    switch (Math.floor(Math.random() * 2) + 1) {
      case 1:
        return message.channel.send("<:1778_monkaW:897957671183990824>");
      case 2:
        return message.channel.send("<:kekw:844464583267319828>");
    }
  }

  if (message.content.includes("feral")) {
    return message.channel.send("ew, ferals.. 🤮");
  }
});

client.login(config.token);
