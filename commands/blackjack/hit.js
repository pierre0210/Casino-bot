const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

async function run(client, interaction) {
	
}

module.exports.data = new SlashCommandBuilder()
	.setName('hit')
	.setDescription('加牌');

module.exports.run = run;