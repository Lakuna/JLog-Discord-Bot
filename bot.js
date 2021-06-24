const { Client, MessageEmbed, APIMessage } = require("discord.js");

// Create client.
// Invite link: // https://discord.com/api/oauth2/authorize?client_id=857652604367405136&permissions=3072&scope=bot
const client = new Client({ ws: { intents: [ "GUILDS", "GUILD_INVITES" ] } });

// Colors.
const SUCCESS_COLOR = "#50C878";
const INFO_COLOR = "5078C8";
const WARNING_COLOR = "#FFE791";
const ERROR_COLOR = "C80815";

// Error handling.
client.on("error", console.error);
client.on("shardError", console.error);

// Startup.
client.on("ready", () => client.user.setActivity("Join Log"));

// Login.
client.login(process.env.TOKEN);