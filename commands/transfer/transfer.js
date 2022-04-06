const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const currency = require('../../modules/database/currency.js');

async function run(client, interaction) {
    const CS = new currency.system(interaction.guild.id);
    const target = interaction.options.getUser('target');
    const user = interaction.user;
    const amount = interaction.options.getInteger('amount');
    if(await CS.isUserExist(target.id) && await CS.isUserExist(user.id)) {
        const targetStats = await CS.getUserStats(target.id);
        const userStats = await CS.getUserStats(user.id);
        if(userStats.balance < amount) {
            await interaction.reply({ content: '餘額不足', ephemeral: true })
        }
        else if(amount <= 0) {
            await interaction.reply({ content: '還想鑽漏洞啊', ephemeral: true })
        }
        else if(target.id === user.id) {
            await interaction.reply({ content: '這樣算洗錢?', ephemeral: true })
        }
        else {
            await CS.updateBalance(target.id, targetStats.balance + amount);
            await CS.updateBalance(user.id, userStats.balance - amount);
            await interaction.reply(`<@${user.id}> **--->${amount}--->** <@${target.id}>`)
        }
    }
    else {
        await interaction.reply({ content: '此人非玩家!', ephemeral: true });
    }
}

module.exports.data = new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('轉帳')
    .addUserOption(option => option.setName('target').setDescription('目標使用者').setRequired(true))
    .addIntegerOption(option => option.setName('amount').setDescription('金額').setRequired(true));

module.exports.run = run;