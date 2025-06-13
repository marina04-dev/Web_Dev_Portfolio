import { Hand } from "./hand";
import { Card } from "./card";

export class Player extends Hand {
    private bankroll: number;
    private bet: number = 0;

    constructor(initialBankroll: number) {
        super();
        this.bankroll = initialBankroll;
    }

    public getBankroll(): number {
        return this.bankroll;
    }

    public placeBet(amount: number): boolean {
        if (amount > 0 && amount <= this.bankroll) {
            this.bet = amount;
            this.bankroll -= amount;
            return true;
        }
        console.log('Invalid bet amount or insufficient funds.');
        return false;
    }

    public winBet(payoutMultiplier: number = 2): void {
        this.bankroll += this.bet * payoutMultiplier;
        this.bet = 0;
    }

    public pushBet(): void {
        this.bankroll += this.bet;
        this.bet = 0;
    }

    public loseBet(): void {
        this.bet = 0; // lose bet
    }

    public hasBlackjack(): boolean {
        return this.getHandValue() === 21 && this.getCards().length === 2;
    }
}