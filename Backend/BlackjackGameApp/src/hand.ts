import { Card, calculateHandValue, getHandString } from "./card";

export class Hand {
    protected cards: Card[] = [];

    public addCard(card: Card): void {
        this.cards.push(card);
    }

    public getCards(): Card[] {
        return [...this.cards]; // returns a copy of all cards
    }

    public getHandValue(): number {
        return calculateHandValue(this.cards);
    }

    public getHandString(hideOne: boolean = false): string {
        return getHandString(this.cards, hideOne);
    }

    public clearHand(): void {
        this.cards = [];
    }
}