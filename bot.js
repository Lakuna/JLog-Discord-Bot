const { Client, MessageEmbed } = require("discord.js");

// Create client.
// Invite link: https://discord.com/api/oauth2/authorize?client_id=857652604367405136&permissions=3104&scope=bot
const client = new Client({
	partials: [ "GUILD_MEMBER" ],
	ws: { intents: [ "GUILDS", "GUILD_MEMBERS", "GUILD_INVITES" ] }
});

// Colors.
const SUCCESS_COLOR = "#50C878";
const INFO_COLOR = "#5078C8";
const WARNING_COLOR = "#FFE791";
const ERROR_COLOR = "#C80815";

// Invite cache for invite link attribution.
const cachedInvites = new Map();
const cacheInvites = async (guild) => {
	let invites;
	try { invites = await guild.fetchInvites(); } catch { }
	cachedInvites.set(guild.id, invites);
	return invites;
};

// Error handling.
client.on("error", console.error);
client.on("shardError", console.error);

// Startup.
client.on("ready", () => {
	client.guilds.cache.forEach((guild) => cacheInvites(guild));

	client.user.setActivity("Join Log");
});

// When added to guild.
client.on("guildCreate", (guild) => cacheInvites(guild));

// When a member joins the guild.
client.on("guildMemberAdd", async (member) => {
	// Compare invites.
	const oldInvites = cachedInvites.get(member.guild.id);
	const newInvites = await cacheInvites(member.guild);

	if (!member.guild.systemChannel) { return; }

	// Make join message.
	const embed = new MessageEmbed()
		.setColor(INFO_COLOR)
		.setTitle("Member Joined")
		.setDescription(`${member} has joined the guild.`)
		.setThumbnail(member.user.displayAvatarURL());

	// Send join message.
	try {
		// Find the used invite.
		const usedInvite = newInvites.find((invite) => oldInvites.get(invite.code).uses < invite.uses);

		try {
			member.guild.systemChannel.send(embed
				.addField("Invite", usedInvite.code)
				.addField("Inviter", usedInvite.inviter));
		} catch { } // Insufficient permissions.
	} catch {
		// Send without invite information.
		try {
			member.guild.systemChannel.send(embed);
		} catch { } // Insufficient permissions.
	}
});

// When a member leaves the guild.
client.on("guildMemberRemove", (member) => {
	if (!member.guild.systemChannel) { return; }

	try {
		member.guild.systemChannel.send(new MessageEmbed()
			.setColor(INFO_COLOR)
			.setTitle("Member Left")
			.setDescription(`${member} has left the guild.`)
			.setThumbnail(member.user.displayAvatarURL()));
	} catch { } // Insufficient permissions.
});

// When invites are updated.
client.on("inviteCreate", (invite) => cacheInvites(invite.guild));
client.on("inviteDelete", (invite) => cacheInvites(invite.guild));

// Login.
client.login(process.env.TOKEN);