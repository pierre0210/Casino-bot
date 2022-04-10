const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const currency = require('../../modules/database/currency.js');

async function run(client, interaction) {
	if(interaction.user.id === '818815468349030420') {
		const amount = interaction.options.getInteger('amount');
		const user = interaction.options.getUser('target');
		const CS = new currency.system(interaction.guild.id);
		const stats = await CS.getUserStats(user.id);
		await CS.updateBalance(user.id, stats.balance + amount);
		await interaction.reply({ content: 'ok', ephemeral: true });
	}
	else {
		await interaction.reply({ content: '死仆街', ephemeral: true });
	}
}

module.exports.data = new SlashCommandBuilder()
	.setName('edit')
	.setDescription('Edit database')
	.addUserOption(option => option.setName('target').setDescription('使用者').setRequired(true))
	.addIntegerOption(option => option.setName('amount').setDescription('金額').setRequired(true));

module.exports.run = run;