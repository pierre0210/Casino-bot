const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const currency = require('../../modules/database/currency.js');
const { randomNum } = require('../../modules/utility.js');

async function run(client, interaction) {
    const CS = new currency.system(interaction.guild.id);
    const stats = await CS.getUserStats(interaction.user.id);
    const guess = interaction.options.getString('ht');
    const bets = interaction.options.getInteger('bets');
    if(!stats) {
        await interaction.reply({ content: '請先執行stats指令', ephemeral: true })
    }
    else if(stats.balance < bets) {
        await interaction.reply({ content: '賭注不能高過總財產', ephemeral: true });
    }
    else {
        const coin = ['正面', '反面'];
        const answer = randomNum(0, 1);
        const embed = new MessageEmbed().setColor('#0000FF').setTitle(coin[answer]);
        if(coin[answer] === guess) {
            await CS.updateBalance(interaction.user.id, stats.balance + bets);
            embed.setDescription(`你猜對了 +${bets}`);
            await interaction.reply({ embeds: [embed] });
        }
        else {
            await CS.updateBalance(interaction.user.id, stats.balance - bets);
            embed.setDescription(`你猜錯了 -${bets}`);
            await interaction.reply({ embeds: [embed] });
        }
    }
    
}

module.exports.data = new SlashCommandBuilder()
    .setName('flipcoin')
    .setDescription('Flip coin game')
    .addStringOption(option => option.setName('ht').setDescription('正反面').setRequired(true)
        .addChoice('正面', '正面')
        .addChoice('反面', '反面'))
    .addIntegerOption(option => option.setName('bets').setDescription('your bets').setRequired(true));

module.exports.run = run;