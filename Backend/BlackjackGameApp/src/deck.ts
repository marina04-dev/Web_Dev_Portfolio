import { Card, Suit, Rank } from "./card";

export class Deck {
    private cards: Card[] = [];

    constructor() {
        this.initializeDeck();
        this.shuffle();
    }

    private initializeDeck(): void {
        const suits: Suit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

        for (const suit of suits) {
            for (const rank of ranks) {
                this.cards.push({suit, rank});
            }
        }
    }

    // Shuffles the deck using the Fisher-Yates algorithm
    public shuffle(): void {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i+1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    // Pulls a card from the deck
    public dealCard(): Card {
        if (this.cards.length === 0) {
            // If the deck is empty, rebuilt and shuffle 
            this.initializeDeck();
            this.shuffle();
            console.log('Deck was reshuffled!')
        }
        return this.cards.pop()!; // the ! declares it won't be undefined
    }
}