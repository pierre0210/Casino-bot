const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const currency = require('../../modules/database/currency.js');
const { randomNum } = require('../../modules/utility.js');

async function run(client, interaction) {
	const CS = new currency.system(interaction.guild.id);
	const stats = await CS.getUserStats(interaction.user.id);
	const target = interaction.options.getUser('target');
	const targetStats = await CS.getUserStats(target.id);
	const amount = interaction.options.getInteger('amount');
	const num = randomNum(1, 10);
	if(!stats) {
		await interaction.reply({ content: '請先執行stats指令', ephemeral: true });
	}
	else if(await CS.isUserExist(target.id)) {
		await interaction.reply({ content: '目標不存在', ephemeral: true });
	}
	else if(target.id === interaction.user.id) {
		await interaction.reply({ content: '你在...自虐?', ephemeral: true });
	}
	else if(stats.balance < amount*9) {
		await interaction.reply({ content: '掠奪金額的九倍不得超過總財產', ephemeral: true });
	}
	else if(targetStats.balance*0.05 < amount) {
		await interaction.reply({ content: '掠奪金額不得超過對方財產的5%', ephemeral: true });
	}
	else if(amount < 0) {
		await interaction.reply({ content: '死仆街', ephemeral: true });
	}
	else {
		if(num === 5) {
			await CS.updateBalance(interaction.user.id, stats.balance - amount*9);
			await interaction.reply(`<@${interaction.user.id}> **掠奪** <@${target.id}> **失敗 需繳納罰金 ${amount*9}**`);
		}
		else {
			await CS.updateBalance(target.id, targetStats.balance - amount);
			await CS.updateBalance(interaction.user.id, stats.balance + amount);
			await interaction.reply(`<@${interaction.user.id}> **成功掠奪** <@${target.id}> **${amount}**`);
		}
	}
}

module.exports.data = new SlashCommandBuilder()
	.setName('raid')
	.setDescription('掠奪(有90%的機率成功 失敗將扣除9倍之金額當作罰款)')
	.addUserOption(option => option.setName('target').setDescription('目標').setRequired(true))
	.addIntegerOption(option => option.setName('amount').setDescription('掠奪金額(不得超過對方財產的5%').setRequired(true));

module.exports.run = run;