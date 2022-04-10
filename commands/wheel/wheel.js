const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const currency = require('../../modules/database/currency.js');
const { randomNum } = require('../../modules/utility.js');

async function run(client, interaction) {
	const CS = new currency.system(interaction.guild.id);
	const stats = await CS.getUserStats(interaction.user.id);
	const bets = interaction.options.getInteger('bets');
	const wheel = [0.1, 0.2, 0.3, 0.5, 1.2, 1.5, 1.7, 2.5];
	const arrow = ['↙️', '⬇️', '⬅️', '↖️', '↘️', '⬆️', '➡️', '↗️'];
	if(!stats) {
		await interaction.reply({ content: '請先執行stats指令', ephemeral: true })
	}
	else if(stats.balance < bets) {
		await interaction.reply({ content: '賭注不能高過總財產', ephemeral: true });
	}
	else if(bets < 0) {
		await interaction.reply({ content: '死仆街', ephemeral: true })
	}
	else {
		const pos = randomNum(0, 7);
		const plate = `【0.5】 【1.5】 【2.5】\n\n【0.3】      ${arrow[pos]}       【1.7】\n\n【0.1】 【0.2】 【1.2】`;
		const embed = new MessageEmbed().setColor('#0000FF').setTitle(plate)
			.setDescription(`你贏得${Math.round(bets*wheel[pos])}`);
		await CS.updateBalance(interaction.user.id, stats.balance - bets + Math.round(bets*wheel[pos]));
		await interaction.reply({ embeds: [embed] });
	}
}

module.exports.data = new SlashCommandBuilder()
	.setName('wheel')
	.setDescription('轉盤遊戲')
	.addIntegerOption(option => option.setName('bets').setDescription('賭注').setRequired(true));

module.exports.run = run;