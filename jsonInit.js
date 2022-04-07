const fs = require('fs');

const blackjack = {};

fs.writeFileSync('./modules/blackjack/game.json', JSON.stringify(blackjack, null, 4), (err) => {
    if(err) console.log(err);
    else console.log('blackjack game file created!');
});