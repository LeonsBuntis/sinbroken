/*
 * Bootstrap the bot application.
 */
const { Client, Intents } = require("discord.js");
const config = require("./config.json");
const app = require("./core/app.js");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

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

// TrialVote temp logic for voting
client.on("interactionCreate", async (button) => {
  if (!button.isButton()) return;

  let oldMsg = button.message.content;
  if (oldMsg.includes(`${button.member.displayName}`)) {
    oldMsg = oldMsg.replace(`${button.member.displayName} `, "");
  }

  // TODO - Store in array to fix spaces bug
  switch (button.customId) {
    case "trial-accept":
      button.message.edit(
        oldMsg.replace("ACCEPT:", `ACCEPT:${button.member.displayName} `)
      );
      return button.deferUpdate();
    case "trial-extend":
      button.message.edit(
        oldMsg.replace("EXTEND:", `EXTEND:${button.member.displayName} `)
      );
      return button.deferUpdate();
    case "trial-reject":
      button.message.edit(
        oldMsg.replace("REJECT:", `REJECT:${button.member.displayName} `)
      );
      return button.deferUpdate();

    default:
      return button.deferUpdate();
  }
});

client.login(config.token);
