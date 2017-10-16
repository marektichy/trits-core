"use strict";

const TRITS_GAME_FLIP_TRESHOLD = 3;

const TRITS_GAME_BANK_ID = 'BANK';

const TRITS_GAME_FEE_ID = 'FEE';

class TritsGame {

    /**
     * @constructor putBonus
     * The optional board parameter is the name of the boeard this game is played on
     */

    constructor(board) {

        this.board = board;
        this.bets = {};
        this.bets.I = null; // Game seeder's id

        // Arrays of bets identified by player's ids, in the order of arrival

        this.bets.F = []; // First 
        this.bets.S = []; // Second
        this.bets.G = []; // Gotcha

        this.status = -1; // Status: -1 => new, 0 => running, 1 => finished
        this.flip_treshold = TRITS_GAME_FLIP_TRESHOLD;
        this.nominal = 1; // Nominal value of the game 
        this.triangle = new Triangle();
        this.bonus = 0; // The number of bonus coins
        this.last_player = 0; // ID of the last player so far
    }

    /**
     * @method putBonus
     * Put bonus in the game and return the (negative) amount to be deducted 
     */

    putBonus(amount) {
        this.bonus = amount;
        return -(this.nominal * amount);
    }


    /**
     * @method putBet
     * Put a bet on this game, return the (negative) amount to be deducted from the gamer's balance
     */

    putBet(amount, sender) {

        // Bets on a finished game are not accepted 
        if (this.status == 1) {
            return 0;
        }

        // Bets with a wrong nominal are not accepted 
        if (amount != this.nominal) {
            return 0;
        }

        // First bet starts the game and sets nominal
        if (this.status == -1) {
            this.status = 0;
            this.nominal = amount;
            this.bets.I = sender;
            this.last_player = sender;
            return -amount;
        }

        // Normal bets 
        if (this.status == 0) {
            side = this.throwThreeSideDice(sender);
            this.triangle.hitSide(side);
            if (this.bets[side].hasOwnProperty(sender) == false) {
                // Initilize the counter on this side
                this.bets[side][sender_address] = 0;
            }
            // Register the bet
            this.bets[side][sender]++;
            this.last_player = sender;
        }

        // Bet accepted, game is still on
        if (this.checkTriangleBalance() == true) {

            return -amount;

        } else {
            // Finish the game
            this.status = 1;
            // Won, but rewards will be allocated later
            return -amount;
        }
    }

    /**
     * @method getRewardsTable
     * Return table describing how to distribute the winnings 
     */

    getRewardsTable() {

        // Only give rewards after the game has finished
        if (this.status != 1) return false;

        var winning_side = this.triangle.getWinningSide();
        var winner_id = this.bets[winning_side][this.bets[winning_side].length - 1];
        // TODO: Double check if we have got the right winner 
        // if (this.last_player != winner_id) { do something about it };

        var total_to_distribute = this.getTotal();
        var coin_nominal = this.nominal;
        var total_coins = 0;
        var rewards = {};
        var fee = 0;

        if (winning_side == 'G') {

            // The bank takes it all 
            rewards[TRITS_GAME_BANK_ID] = total_to_distribute;

        } else {

            // Initiator gets FLIP_TRESHOLD (3) times nominal 
            rewards[this.bets.I] = TRITS_GAME_FLIP_TRESHOLD * this.nominal;
            total_to_distribute -= rewards[this.bets.I];

            // Each gamer on the winning side must get his coins back
            total_coins = this.bets[winning_side];

            // Ocassionaly there is not enough money
            if (coin_nominal * total_coins > total_to_distribute) {

                //So we must lower the coin nominal 
                coin_nominal = Math.floor(total_to_distribute / total_coins);
                fee = total_to_distribute % total_coins;

                // The the remainder can be used for some good later 
                if (fee > 0) {
                    rewards[TRITS_GAME_FEE_ID] += fee;
                    total_to_distribute -= fee;
                }
            }

            // Return the coins to those who have helped to flip 
            this.bets[side].forEach(function(player_id) {
                rewards[player_id] += coin_nominal;
                total_to_distribute -= coin_nominal;
            });

            // And finally, all the rest goes to THE WINNER, voilà
            rewards[winner_id] += total_to_distribute;
            total_to_distribute = 0;
            return rewards;
        }
    }

    /**
     * @method getTotal
     * Calculate the total of the game 
     */

    getTotal() {
        var total = 0;
        // 1 is for the I
        total = this.nominal * (1 + this.bets.F.length + this.bets.S.length + this.bets.G.length + this.bonus);
        return total
    }

    /**
     * @method checkTriangleBalance
     * Returns true if the triangle is still balanced, false otherwise
     */

    checkTriangleBalance() {
        return (this.triangle.getInbalance() >= this.flip_treshold);
    }


    /**
     * @method throwThreeSideDice
     * Returns F, S or G depending on the sender and some higher power
     */

    throwThreeSideDice(sender) {

        var random_side = 0;
        random_side = Math.floor(Math.random() * 3 - 1); // 1, 2 or 3 
        switch (random_side % 3 - 1) {
            case -1:
                return 'F';
                break;
            case 0:
                return 'G';
                break;
            case 1:
                return 'S';
                break;
        }
    }

    /**
     * @method getGameStatus
     * Returns the game entire game status 
     */


    getGameStatus() {

        return {
            'board': this.board,
            'bets': this.bets,
            'status': this.status,
            'flip_treshold': this.flip_treshold,
            'nominal': this.nominal,
            'last_player': this.last_player,
            'bonus': this.bonus,
        };
    }
}
