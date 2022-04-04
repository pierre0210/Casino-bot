const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const currency = require('../../modules/database/currency.js');

async function run(client, interaction) {
    const CS = new currency.system(interaction.guild.id);
    const target = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user;
    if(await CS.isUserExist(target.id)) {
        const stats = await CS.getUserStats(target.id);
        const embed = new MessageEmbed().setColor('#0000FF').setTitle('使用者資料')
            .addField('使用者名稱：', target.username, true)
            .addField('使用者ID：', target.id, true)
        if(Date.now()-stats.sign_time >= CS.signDuration*60*60*1000) {
            await CS.updateBalance(interaction.user.id, stats.balance + CS.perSign);
            await CS.updateSignTime(interaction.user.id);
            embed.addField('餘額：', `${stats.balance + CS.perSign}`, true)
                .setDescription(`已簽到 +${CS.perSign}，${CS.signDuration}小時後可再次領取獎勵!`);
        }
        else {
            embed.addField('餘額：', `${stats.balance}`, true)
        }
        await interaction.reply({ embeds: [embed] });
    }
    else if(target.id != interaction.user.id) {
        await interaction.reply({ content: '此人非玩家!', ephemeral: true });
    }
    else {
        await CS.addUser(target.id);
        const embed = new MessageEmbed().setColor('#0000FF').setTitle('使用者資料')
            .setDescription('初來乍到')
            .addField('使用者名稱：', target.username, true)
            .addField('使用者ID：', target.id, true)
            .addField('餘額：', CS.initBalance, true);
        await interaction.reply({ embeds: [embed] });
    }
}

module.exports.data = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('成員資料')
    .addUserOption(option => option.setName('user').setDescription('目標使用者'));

module.exports.run = run;