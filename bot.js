const { Client, Collection, Intents } = require('discord.js');
const LOG = require('./modules/admin/log.js');
const fs = require('fs');
require('dotenv').config();

const token = process.env.TOKEN;
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
client.commands = new Collection();

client.once('ready', () => {
	const commandDir = fs.readdirSync("./commands/")
	for(const dir of commandDir) {
		const slashCommandFiles = fs.readdirSync(`./commands/${dir}/`).filter(f => f.endsWith(".js"));
		for(const slash of slashCommandFiles) {
			let tmp = require(`./commands/${dir}/${slash}`);
			console.log(tmp);
			client.commands.set(slash.split(".")[0], tmp);
		}
	}
	LOG.log('START', `Logged in as ${client.user.tag} !`);
});

client.on("interactionCreate", async interaction => {
	if (interaction.user.bot) return;
	if (interaction.isCommand()) {
		const cmd = client.commands.get(interaction.commandName);

		if(cmd) {
			//console.log(cmd);
			try {
				LOG.log('RUN', `${interaction.user.username} used ${interaction.commandName}`);
				await cmd.run(client, interaction);
			} catch(error) {
				console.log(error);
			}
		}
	}
});

client.login(token);