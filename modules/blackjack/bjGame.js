const fs = require('fs');
const currency = require('../../modules/database/currency.js');
const { poker } = require('./poker.js');

class Blackjack {
    constructor(guildID) {
        this.guildID = guildID;
        this.gameFile = JSON.parse(fs.readFileSync('./modules/blackjack/game.json', 'utf-8'));
        this.CS = new currency.system(guildID);
    }
    isGameExist() {
        if(this.gameFile[this.guildID]) return true;
        else return false;
    }
    initGame() {
        const game = {
            playerList: [],
            deck: []
        }
        this.gameFile[this.guildID] = game;
		fs.writeFileSync('./modules/blackjack/game.json', JSON.stringify(this.gameFile, null, 4), (err) => {
            if(err) console.log(err);
        });
    }
    addPlayer(userID) {
        this.gameFile = JSON.parse(fs.readFileSync('./modules/blackjack/game.json', 'utf-8'));
        const player = {
            id: userID,
            hand: [],
            bets: 0
        }
        this.gameFile[this.guildID].playerList.push(player);
        fs.writeFileSync('./modules/blackjack/game.json', JSON.stringify(this.gameFile, null, 4), (err) => {
            if(err) console.log(err);
        });
    }
}

module.exports.Blackjack = Blackjack;