const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const currency = require('../../modules/database/currency.js');
const { randomNum } = require('../../modules/utility.js');

async function run(client, interaction) {
    const diceList = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    const CS = new currency.system(interaction.guild.id);
    const stats = await CS.getUserStats(interaction.user.id);
    const bets = interaction.options.getInteger('bets');
    const subcommand = interaction.options.getSubcommand();
    if(!stats) {
        await interaction.reply({ content: '請先執行stats指令', ephemeral: true })
    }
    else if(stats.balance < bets) {
        await interaction.reply({ content: '賭注不能高過總財產', ephemeral: true });
    }
    else {
        const embed = new MessageEmbed().setColor('#0000FF');
        if(subcommand === 'bigorsmall') {
            const guess = interaction.options.getString('bs');
            const diceA = randomNum(1, 6);
            const diceB = randomNum(1, 6);
            const diceC = randomNum(1, 6);
            const sum = diceA + diceB + diceC;
            const state = sum > 10 ? '大' : '小';
            if(diceA === diceB && diceB === diceC) {
                embed.setTitle(`${diceList[diceA-1]} ${diceList[diceB-1]} ${diceList[diceC-1]}`)
                    .setDescription(`你輸了!(三個骰子數字相同) -${bets}`);
                await CS.updateBalance(interaction.user.id, stats.balance - bets);
            }
            else if(state === guess) {
                embed.setTitle(`${diceList[diceA-1]} ${diceList[diceB-1]} ${diceList[diceC-1]}`)
                    .setDescription(`**${state}** 你贏了! +${bets}`);
                await CS.updateBalance(interaction.user.id, stats.balance + bets);
            }
            else {
                embed.setTitle(`${diceList[diceA-1]} ${diceList[diceB-1]} ${diceList[diceC-1]}`)
                    .setDescription(`**${state}** 你輸了! -${bets}`);
                await CS.updateBalance(interaction.user.id, stats.balance - bets);
            }
            await interaction.reply({ embeds: [embed] });
        }
        else if(subcommand === 'singlenum') {
            
        }
        else if(subcommand === 'twonum') {
    
        }
    }
}

module.exports.data = new SlashCommandBuilder()
    .setName('dice')
    .setDescription('骰子比大小or猜點數')
    .addSubcommand(sub => sub
        .setName('bigorsmall')
        .setDescription('比大小(一賠一)')
        .addStringOption(option => option.setName('bs').setDescription('大或小')
            .addChoice('大', '大')
            .addChoice('小', '小')
            .setRequired(true))
        .addIntegerOption(option => option.setName('bets').setDescription('賭注').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('singlenum')
        .setDescription('一個數字出現一次(一賠一)出現兩次(一賠二)出現三次(一賠三)')
        .addIntegerOption(option => option.setName('num').setDescription('一到六的數字')
            .addChoice('1', 1).addChoice('2', 2).addChoice('3', 3).addChoice('4', 4).addChoice('5', 5).addChoice('6', 6).setRequired(true))
        .addIntegerOption(option => option.setName('bets').setDescription('賭注').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('twonum')
        .setDescription('兩數字出現在三個骰子中(一賠六)')
        .addIntegerOption(option => option.setName('a').setDescription('一到六的數字')
            .addChoice('1', 1).addChoice('2', 2).addChoice('3', 3).addChoice('4', 4).addChoice('5', 5).addChoice('6', 6).setRequired(true))
        .addIntegerOption(option => option.setName('b').setDescription('一到六的數字')
            .addChoice('1', 1).addChoice('2', 2).addChoice('3', 3).addChoice('4', 4).addChoice('5', 5).addChoice('6', 6).setRequired(true))
        .addIntegerOption(option => option.setName('bets').setDescription('賭注').setRequired(true)));

module.exports.run = run;