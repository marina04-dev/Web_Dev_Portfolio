import { Hand } from "./hand";
import { Card } from "./card";
import { calculateHandValue } from "./card";

export class Dealer extends Hand {
    constructor() {
        super();
    }

    // Dealer's strategy: hits if total is < 17, either way it stands
    public shouldHit(): boolean {
        return this.getHandValue() < 17;
    }

    public hasBlackjack(): boolean {
        return this.getHandValue() === 21 && this.getCards().length === 2;
    }
}