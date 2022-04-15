const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const currency = require('../../modules/database/currency.js');
const { poker, pokerUtil } = require('./poker.js');

class Blackjack {
	constructor(guildID) {
		this.guildID = guildID;
		this.gameFile = JSON.parse(fs.readFileSync('./modules/blackjack/game.json', 'utf-8'));
		this.CS = new currency.system(guildID);
		this.deckNum = 4;
		this.shuffleTimes = 1000;
	}
	isGameExist() {
		if(this.gameFile[this.guildID]) return true;
		else return false;
	}
	isPlayerInGame(userID) {
		for(const user of this.gameFile[this.guildID].playerList) {
			if(user.id === userID) {
				return true;
			}
		}
		return false;
	}
	initGame() {
		const deck = new poker().buildDeck(this.deckNum, this.shuffleTimes);
		const game = {
			turn: 0,
			dealerHand: [],
			playerList: [],
			deck: deck,
			pending: true
		}
		this.gameFile[this.guildID] = game;
		fs.writeFileSync('./modules/blackjack/game.json', JSON.stringify(this.gameFile, null, 4), (err) => {
			if(err) console.log(err);
		});
	}
	printTable(message, turn) {
		this.gameFile = JSON.parse(fs.readFileSync('./modules/blackjack/game.json', 'utf-8'));
		const infoEmbed = new MessageEmbed().setColor('#0000FF');
		if(turn != -1) {
			infoEmbed.setTitle(`牌局進行中`);
			infoEmbed.setDescription(`<@${this.gameFile[this.guildID].playerList[turn].id}> 的回合`);
		}
		else {
			infoEmbed.setTitle(`牌局結束`);
		}
		infoEmbed.addField('Dealer', `${this.gameFile[this.guildID].dealerHand[0].symbol}${this.gameFile[this.guildID].dealerHand[0].value}\n${this.gameFile[this.guildID].dealerHand[1].symbol}${this.gameFile[this.guildID].dealerHand[1].value}`);
		for(const user of this.gameFile[this.guildID].playerList) {
			let hand = '';
			for(const card of user.hand) {
				if(!card) continue;
				hand += card.symbol+card.value+'\n';
			}
			infoEmbed.addField(`${user.name}`, `${hand}`);
		}
		message.channel.send({ embeds: [infoEmbed] });
	}
	startGame(message) {
		this.gameFile = JSON.parse(fs.readFileSync('./modules/blackjack/game.json', 'utf-8'));
		if(this.gameFile[this.guildID].playerList === 0) {
			delete this.gameFile[this.guildID];
			message.channel.send('人數不足!');
		}
		const infoEmbed = new MessageEmbed().setColor('#0000FF').setTitle('牌局開始')
			.setDescription(`<@${this.gameFile[this.guildID].playerList[0].id}> 的回合`);
		this.gameFile[this.guildID].dealerHand.push(this.gameFile[this.guildID].deck.pop());
		this.gameFile[this.guildID].dealerHand.push(this.gameFile[this.guildID].deck.pop());
		//console.log(this.gameFile[this.guildID]);
		infoEmbed.addField('Dealer', `${this.gameFile[this.guildID].dealerHand[0].symbol}${this.gameFile[this.guildID].dealerHand[0].value}\n${this.gameFile[this.guildID].dealerHand[1].symbol}${this.gameFile[this.guildID].dealerHand[1].value}`);
		for(const user of this.gameFile[this.guildID].playerList) {
			user.hand.push(this.gameFile[this.guildID].deck.pop());
			user.hand.push(this.gameFile[this.guildID].deck.pop());
			infoEmbed.addField(`${user.name}`, `${user.hand[0].symbol}${user.hand[0].value}\n${user.hand[1].symbol}${user.hand[1].value}`);
		}
		fs.writeFileSync('./modules/blackjack/game.json', JSON.stringify(this.gameFile, null, 4), (err) => {
			if(err) console.log(err);
		});
		
		message.channel.send({ embeds: [infoEmbed] });
	}
	getWhoseTurn() {
		this.gameFile = JSON.parse(fs.readFileSync('./modules/blackjack/game.json', 'utf-8'));
		return this.gameFile[this.guildID].turn;
	}
	isPlayerTurn(userID) {
		this.gameFile = JSON.parse(fs.readFileSync('./modules/blackjack/game.json', 'utf-8'));
		for(let i=0; i<this.gameFile[this.guildID].playerList.length; i++) {
			if(this.gameFile[this.guildID].playerList[i].id === userID) {
				if(i === this.gameFile[this.guildID].turn) {
					return true;
				}
				else {
					return false;
				}
			}
		}
	}
	async hit(interaction) {
		const util = new pokerUtil()
		this.gameFile = JSON.parse(fs.readFileSync('./modules/blackjack/game.json', 'utf-8'));
		const turn = this.gameFile[this.guildID].turn
		if(!this.isPlayerInGame(interaction.user.id)) await interaction.reply({ content: '你不在此局內', ephemeral: true });
		else {
			if(!this.isPlayerTurn(interaction.user.id)) await interaction.reply({ content: '還沒輪到你', ephemeral: true });
			else {
				const isLastOne = this.gameFile[this.guildID].playerList.length-1 === turn ? true : false;
				const card = this.gameFile[this.guildID].deck.pop();
				//console.log(card);
				this.gameFile[this.guildID].playerList[turn].hand.push(card);
				//console.log(this.gameFile[this.guildID].playerList[turn].hand);
				const sum = util.countHandPoint(this.gameFile[this.guildID].playerList[turn].hand);
				if(sum <= 21) {
					let embed = new MessageEmbed().setColor('#0000FF')
						.setDescription(`<@${interaction.user.id}> 加牌!`);
					await interaction.reply({ embeds:[embed] });
					const msg = await interaction.fetchReply();
					fs.writeFileSync('./modules/blackjack/game.json', JSON.stringify(this.gameFile, null, 4), (err) => {
						if(err) console.log(err);
					});
					
					if(isLastOne) {
						this.printTable(msg, -1);
						this.endGame(msg);
					}
					else {
						this.printTable(msg, turn+1);
					}
				}
				else {
					let embed = new MessageEmbed().setColor('#0000FF')
						.setDescription(`<@${interaction.user.id}> ${sum} 爆了!`);
					await interaction.reply({ embeds:[embed] });
					this.gameFile[this.guildID].playerList[turn].done = true;
					fs.writeFileSync('./modules/blackjack/game.json', JSON.stringify(this.gameFile, null, 4), (err) => {
						if(err) console.log(err);
					});
					const msg = await interaction.fetchReply();
					if(isLastOne) {
						this.printTable(msg, -1);
						this.endGame(msg);
					}
					else {
						this.printTable(msg, turn+1);
					}
				}
			}
		}
	}
	stand() {

	}
	doubleDown() {

	}
	endGame(message) {
		console.log('end');
	}
	addPlayer(userID, userName, bets) {
		let isPlayerInGame = false;
		this.gameFile = JSON.parse(fs.readFileSync('./modules/blackjack/game.json', 'utf-8'));
		for(let i=0; i<this.gameFile[this.guildID].playerList.length; i++) {
			if(this.gameFile[this.guildID].playerList[i].id === userID) {
				isPlayerInGame = true;
				return false;
			}
		}
		const player = {
			id: userID,
			name: userName,
			hand: [],
			bets: bets,
			done: false,
			bust: false
		}
		this.gameFile[this.guildID].playerList.push(player);
		fs.writeFileSync('./modules/blackjack/game.json', JSON.stringify(this.gameFile, null, 4), (err) => {
			if(err) console.log(err);
		});
		return true;
	}
	renewDeck() {
		const deck = new poker().buildDeck(this.deckNum, this.shuffleTimes);
		this.gameFile = JSON.parse(fs.readFileSync('./modules/blackjack/game.json', 'utf-8'));
		this.gameFile[this.guildID].deck = deck;
		fs.writeFileSync('./modules/blackjack/game.json', JSON.stringify(this.gameFile, null, 4), (err) => {
			if(err) console.log(err);
		});
	}
	stopPending() {
		this.gameFile = JSON.parse(fs.readFileSync('./modules/blackjack/game.json', 'utf-8'));
		this.gameFile[this.guildID].pending = false;
		fs.writeFileSync('./modules/blackjack/game.json', JSON.stringify(this.gameFile, null, 4), (err) => {
			if(err) console.log(err);
		});
	}
}

module.exports.Blackjack = Blackjack;