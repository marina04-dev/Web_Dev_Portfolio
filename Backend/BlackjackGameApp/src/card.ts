export type Suit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'Jack' | 'Queen' | 'King' | 'Ace';

export interface Card {
    suit: Suit;
    rank: Rank;
}

// Returns the arithmetic value of the card (Ace can be either 1 or 11)
export function getCardValue(card: Card): number {
    switch (card.rank) {
        case '2': return 2;
        case '3': return 3;
        case '4': return 4;
        case '5': return 5;
        case '6': return 6;
        case '7': return 7;
        case '8': return 8;
        case '9': return 9;
        case '10':
        case 'Jack':
        case 'Queen':
        case 'King': return 10;
        case 'Ace': return 11;
        default: return 0; // It should not happen
    }
}

// Calculates the total of a hand, taking into consideration the duality of Ace
export function calculateHandValue(hand: Card[]): number {
    let value = 0;
    let numAces = 0;

    for (const card of hand) {
        value += getCardValue(card);
        if (card.rank === 'Ace') {
            numAces++;
        }
    }

    // If the total exceeds 21 and there are Aces, decrease the Ace's value to 1
    while (value > 21 && numAces > 0) {
        value -= 10;
        numAces--;
    }
    return value;
}

// Returns a formatted string with the hand
export function getHandString(hand: Card[], hideOne: boolean = false): string {
    if (hideOne && hand.length > 0) {
        const visibleCards = hand.slice(1).map(c => `${c.rank} of ${c.suit}`);
        return `[Hidden Card], ${visibleCards.join(', ')}`;
    }
    return hand.map(c => `${c.rank} of ${c.suit}`).join(', ');
}