const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Blackjack } = require('../../modules/blackjack/bjGame.js');
const currency = require('../../modules/database/currency.js');

async function run(client, interaction) {
	const BJ = new Blackjack(interaction.guild.id);
}

module.exports.data = new SlashCommandBuilder()
	.setName('hit')
	.setDescription('加牌');

module.exports.run = run;