class poker{
	constructor(num, times){
		this.deck = this.shuffleDeck(this.buildDeck(num), times);
	}
	
	buildDeck(num){
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
		return deck;
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
	drawCard(){
		let card = this.deck.pop();
		return card;
	}
	getDeckNum(){
		return this.deck.length;
	}
}

module.exports.poker = poker;