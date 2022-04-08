class poker{
	constructor() {}
	buildDeck(num, times){
		//const symbol = ['spades', 'hearts', 'diamonds', 'clubs'];
		const symbol = ['\u2660', '\u2665', '\u2666', '\u2663'];
		const value = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
		let deck = new Array();
		for(let i=0; i<num; i++){
			for(let j=0; j<symbol.length; j++){
				for(let k=0; k<value.length; k++){
					let card = { "symbol": symbol[j], "value": value[k] };
					deck.push(card);
				}
			}
		}
		return this.shuffleDeck(deck, times);
	}
	shuffleDeck(deck, times){
		for(let i=0; i<times; i++){
			let a = Math.floor(Math.random()*deck.length);
			let b = Math.floor(Math.random()*deck.length);
			
			let tmp = deck[a];
			deck[a] = deck[b];
			deck[b] = tmp;
		}
		return deck;
	}
}

class pokerUtil {
	constructor() {}
	countHandPoint(hand) {
		let sum = 0;
		let aceCount = 0;
		for(const card of hand) {
			if(card.value === 'J' || card.value === 'Q' || card.value === 'K') {
				sum += 10;
			}
			else if(card.value === 'A') {
				aceCount++;
			}
			else {
				sum += parseInt(card.value);
			}
		}
		for(let i = 1; i <= aceCount; i++) {
			if(sum + (aceCount-i) + i*11 > 21) {
				sum += (aceCount-i-1) + (i-1)*11;
			}
			else if(i === aceCount) {
				sum += aceCount*11;
			}
		}
		return sum;
	}
}

module.exports.poker = poker;
module.exports.pokerUtil = pokerUtil;