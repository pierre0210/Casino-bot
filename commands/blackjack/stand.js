const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

async function run(client, interaction) {
	
}

module.exports.data = new SlashCommandBuilder()
	.setName('stand')
	.setDescription('停止加牌');

module.exports.run = run;