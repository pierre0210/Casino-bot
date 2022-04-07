const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

async function run(client, interaction) {
	const subcommand = interaction.options.getSubcommand();
	if(subcommand === 'start') {
		
	}
}

module.exports.data = new SlashCommandBuilder()
    .setName('blackjack')
    .setDescription('21點遊戲')
    .addSubcommand(sub => sub.setName('start').setDescription('開始遊戲'))
    .addSubcommand(sub => sub.setName('join').setDescription('加入存在的牌局'));

module.exports.run = run;