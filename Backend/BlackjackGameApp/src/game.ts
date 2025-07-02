import promptSync from 'prompt-sync'; // 
import { Deck } from './deck';
import { Player } from './player';
import { Dealer } from './dealer';
import { Card, calculateHandValue, getHandString } from './card';

const prompt = promptSync();

// Console's styling optimization (ANSI colors)
const COLORS = { RESET: "\x1b[0m", RED: "\x1b[31m", GREEN: "\x1b[32m", YELLOW: "\x1b[33m", BLUE: "\x1b[34m", MAGENTA: "\x1b[35m", CYAN: "\x1b[36m", WHITE: "\x1b[37m", BRIGHT_RED: "\x1b[91m", BRIGHT_GREEN: "\x1b[92m", BRIGHT_YELLOW: "\x1b[93m", BRIGHT_BLUE: "\x1b[94m", BRIGHT_MAGENTA: "\x1b[95m", BRIGHT_CYAN: "\x1b[96m",BRIGHT_WHITE: "\x1b[97m"};

export class BlackjackGame {
    private deck: Deck;
    private player: Player;
    private dealer: Dealer;

    constructor() {
        this.deck = new Deck();
        this.player = new Player(100); //  Player begins with $100
        this.dealer = new Dealer();
    }

    public startGame(): void {
        console.log(`${COLORS.BRIGHT_CYAN}Welcome to Simplified Blackjack!${COLORS.RESET}`);
        console.log(`${COLORS.BRIGHT_CYAN}Get ready to test your luck against the dealer!${COLORS.RESET}`);
        console.log(`\n${COLORS.YELLOW}Your current bankroll: $${this.player.getBankroll()}${COLORS.RESET}`);

        while (this.player.getBankroll() > 0) { //  Game continues until the player runs out of money
            this.playRound();
            if (this.player.getBankroll() > 0) {
                const playAgain = prompt(`${COLORS.BRIGHT_MAGENTA}Do you want to play another round? (y/n): ${COLORS.RESET}`).toLowerCase();
                if (playAgain !== 'y') {
                    console.log(`${COLORS.BRIGHT_CYAN}Thanks for playing! Your final bankroll: $${this.player.getBankroll()}${COLORS.RESET}`);
                    break;
                }
            } else {
                console.log(`${COLORS.RED}You've run out of money! Game over.${COLORS.RESET}`); 
            }
        }
    }

    private playRound(): void {
        console.log(`\n--- NEW ROUND ---`);
        this.player.clearHand();
        this.dealer.clearHand();
        this.deck = new Deck();  // New deck for each round

        let betAmount: number;
        while (true) {
            const input = prompt(`${COLORS.BRIGHT_MAGENTA}Enter your bet (current bankroll: $${this.player.getBankroll()}): $${COLORS.RESET}`);
            betAmount = parseInt(input);
            if (isNaN(betAmount) || !this.player.placeBet(betAmount)) {
                console.log(`${COLORS.RED}Please enter a valid bet amount less than or equal to your bankroll.${COLORS.RESET}`);
            } else {
                break;
            }
        }
        console.log(`${COLORS.GREEN}You placed a bet of $${betAmount}.${COLORS.RESET}`);

        this.player.addCard(this.deck.dealCard());
        this.dealer.addCard(this.deck.dealCard());
        this.player.addCard(this.deck.dealCard());
        this.dealer.addCard(this.deck.dealCard());

        this.displayHands(true);

        // Check for Blackjack
        const playerBlackjack = this.player.hasBlackjack();
        const dealerBlackjack = this.dealer.hasBlackjack();

        if (playerBlackjack && dealerBlackjack) {
            console.log(`${COLORS.YELLOW}Both player and dealer have Blackjack! It's a push.${COLORS.RESET}`); 
            this.player.pushBet();
            this.displayHands(false); // display all cards
            return;
        } else if (playerBlackjack) {
            console.log(`${COLORS.GREEN}Blackjack! You win 3:2 on your bet!${COLORS.RESET}`); // 
            this.player.winBet(2.5); // 1.5 (profit) + 1 (bet return) = 2.5 * bet
            this.displayHands(false);
            return;
        } else if (dealerBlackjack) {
            console.log(`${COLORS.RED}Dealer has Blackjack! You lose.${COLORS.RESET}`); // 
            this.player.loseBet();
            this.displayHands(false);
            return;
        }

        let playerBusted = false;
        while (true) {
            const playerHandValue = this.player.getHandValue();
            if (playerHandValue > 21) {
                console.log(`${COLORS.RED}Your hand: ${this.player.getHandString()} (Total: ${playerHandValue} - Bust!)${COLORS.RESET}`); // 
                playerBusted = true;
                break;
            }

            const action = prompt(`${COLORS.BRIGHT_MAGENTA}Your action (hit/stand): ${COLORS.RESET}`).toLowerCase(); // 

            if (action === 'hit') { 
                this.player.addCard(this.deck.dealCard());
                this.displayHands(true);
            } else if (action === 'stand') {  
                console.log(`${COLORS.YELLOW}You chose to stand.${COLORS.RESET}`);
                break;
            } else {
                console.log(`${COLORS.RED}Invalid action. Please type 'hit' or 'stand'.${COLORS.RESET}`);
            }
        }

        if (playerBusted) {
            console.log(`${COLORS.RED}You bust and lose $${betAmount}.${COLORS.RESET}`); // 
            this.player.loseBet();
            return;
        }

        // Dealer's turn
        console.log(`\n${COLORS.YELLOW}Dealer's Turn:${COLORS.RESET}`);
        this.displayHands(false);

        let dealerBusted = false;
        while (this.dealer.shouldHit()) { // 
            console.log(`${COLORS.YELLOW}Dealer hits...${COLORS.RESET}`);
            this.dealer.addCard(this.deck.dealCard());
            this.displayHands(false);
            if (this.dealer.getHandValue() > 21) {
                console.log(`${COLORS.GREEN}Dealer's hand: ${this.dealer.getHandString()} (Total: ${this.dealer.getHandValue()} - Bust!)${COLORS.RESET}`); // 
                dealerBusted = true;
                break;
            }
        }

        if (!dealerBusted) {
            console.log(`${COLORS.YELLOW}Dealer stands.${COLORS.RESET}`); 
        }

        // Declare the winner
        this.determineWinner(betAmount);
    }
    
    private displayHands(hideDealerCard: boolean): void {
        console.log(`\n${COLORS.BLUE}--- Hands ---${COLORS.RESET}`);
        console.log(`${COLORS.CYAN}Your hand: ${this.player.getHandString()} (Total: ${this.player.getHandValue()})${COLORS.RESET}`);
        console.log(`${COLORS.CYAN}Dealer's hand: ${this.dealer.getHandString(hideDealerCard)} ${hideDealerCard ? '' : `(Total: ${this.dealer.getHandValue()})`}${COLORS.RESET}`);
        console.log(`${COLORS.BLUE}-------------${COLORS.RESET}`);
    }

    private determineWinner(betAmount: number): void {
        const playerValue = this.player.getHandValue();
        const dealerValue = this.dealer.getHandValue();

        if (playerValue > 21) {
            // If the player has already lost
            console.log(`${COLORS.RED}You bust and lose $${betAmount}.${COLORS.RESET}`); // 
            this.player.loseBet();
        } else if (dealerValue > 21) {
            console.log(`${COLORS.GREEN}Dealer busts! You win $${betAmount}!${COLORS.RESET}`);  
            this.player.winBet();
        } else if (playerValue > dealerValue) {
            console.log(`${COLORS.GREEN}You win $${betAmount}! Your hand is closer to 21.${COLORS.RESET}`); 
            this.player.winBet();
        } else if (dealerValue > playerValue) {
            console.log(`${COLORS.RED}Dealer wins. You lose $${betAmount}.${COLORS.RESET}`); 
            this.player.loseBet();
        } else {
            console.log(`${COLORS.YELLOW}It's a Push! Your bet is returned.${COLORS.RESET}`); 
            this.player.pushBet();
        }
        console.log(`${COLORS.YELLOW}Your current bankroll: $${this.player.getBankroll()}${COLORS.RESET}`);
    }
}