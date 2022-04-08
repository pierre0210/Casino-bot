const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Blackjack } = require('./../../modules/blackjack/bjGame.js');
const currency = require('../../modules/database/currency.js');

async function run(client, interaction) {
	const BJ = new Blackjack(interaction.guild.id);
	const subcommand = interaction.options.getSubcommand();
	const pendingTime = 20;
	const CS = new currency.system(interaction.guild.id);
	if(subcommand === 'start') {
		if(BJ.isGameExist()) {
			await interaction.reply({ content: '此群有牌局進行中', ephemeral: true });
		}
		else {
			BJ.initGame();
			const startEmbed = new MessageEmbed().setColor('#0000FF').setTitle('Blackjack牌局開始')
				.setDescription('輸入`/blackjack join <賭注>`加入牌局\n此局將在'+pendingTime+'秒後開始!!');
			await interaction.reply({ embeds: [startEmbed] });
			const message = await interaction.fetchReply()
			setTimeout(() => {
				BJ.stopPending();
				BJ.startGame(message);
			}, pendingTime*1000);
		}
	}
	else if(subcommand === 'join') {
		const stats = CS.getUserStats(interaction.user.id);
		const bets = interaction.options.getInteger('bets');
		if(stats.balance < bets) {
			await interaction.reply({ content: '賭注不能高過總財產', ephemeral: true });
		}
		else if(BJ.isGameExist()) {
			BJ.addPlayer(interaction.user.id, bets);
			const joinEmbed = new MessageEmbed().setColor('#0000FF').setDescription(`<@${interaction.user.id}> 加入牌局`);
			await interaction.reply({ embeds: [joinEmbed] });
		}
		else {
			await interaction.reply({ content: '此群沒有有牌局進行中 輸入`/blackjack start`創建牌局!', ephemeral: true });
		}
	}
}

module.exports.data = new SlashCommandBuilder()
    .setName('blackjack')
    .setDescription('21點遊戲')
    .addSubcommand(sub => sub.setName('start').setDescription('開始遊戲'))
    .addSubcommand(sub => sub.setName('join').setDescription('加入存在的牌局')
		.addIntegerOption(option => option.setName('bets').setDescription('賭注').setRequired(true)));

module.exports.run = run;