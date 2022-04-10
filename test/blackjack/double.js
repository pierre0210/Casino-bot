const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

async function run(client, interaction) {
	
}

module.exports.data = new SlashCommandBuilder()
	.setName('double')
	.setDescription('雙倍加注');

module.exports.run = run;