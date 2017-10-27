"use strict";


const TRITS_GAME_FLIP_TRESHOLD = 3;

const TRITS_GAME_BANK_ID = 'BANK99999999999999999999999999999999999999999999999999999999999999999999999999999';

const TRITS_GAME_FEE_ID = 'FEES99999999999999999999999999999999999999999999999999999999999999999999999999999';

var TritsTriangle = require('./trits-triangle.js');
var moment = require('moment');

class TritsGame {

    /**
     * @constructor
     * The optional board parameter is the name of the board this game is played on
     */

    constructor(board) {

        this.board = board;
        this.timestamp = null;
        this.bets = {};
        this.bets.I = null; // Game seeder's id

        // Arrays of bets identified by player's ids, in the order of arrival

        this.bets.F = []; // First 
        this.bets.S = []; // Second
        this.bets.G = []; // Gotcha

        this.status = -1; // Status: -1 => new, 0 => running, 1 => finished
        this.flip_treshold = TRITS_GAME_FLIP_TRESHOLD;
        this.nominal = 0; // Nominal value of the game
        this.triangle = new TritsTriangle(0, 0, 0);
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

        var side = null;

        // Bets on a finished game are not accepted 
        if (this.status == 1) {
            return 0;
        }

        // Bets with a wrong nominal on a running game  are not accepted
        if (this.status == 0 && amount != this.nominal) {
            return 0;
        }

        // First bet starts the game, sets the nominal and timestamp
        if (this.status == -1) {
            var now = moment();
            this.timestamp = now.format('x');
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
            // Register the bet
            this.bets[side].push(sender);
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
            total_coins = this.bets[winning_side].length;

            // Ocassionaly there is not enough money
            if (coin_nominal * total_coins > total_to_distribute) {

                //So we must lower the coin nominal 
                coin_nominal = Math.floor(total_to_distribute / total_coins);
                fee = total_to_distribute % total_coins;

                // The the remainder can be used for some good later 
                if (fee > 0) {
                    rewards[TRITS_GAME_FEE_ID] = fee;
                    total_to_distribute -= fee;
                }
            }

            // Return the coins to those who have helped to flip
            var winners_array = this.bets[winning_side];
            // Prepare money sacks
            winners_array.forEach(function(player_id) {
                rewards[player_id] = 0;
            });
            winners_array.forEach(function(player_id) {
                rewards[player_id] += coin_nominal;
                total_to_distribute -= coin_nominal;
            });

            // And finally, all the rest goes to THE WINNER, voilà
            rewards[winner_id] += total_to_distribute;
            total_to_distribute = 0;
        }
        return rewards;
    }

    /**
     * @method getTotal
     * Calculate the total of the game 
     */

    getTotal() {
        // 1 is for the I
        return this.nominal * (1 + this.bets.F.length + this.bets.S.length + this.bets.G.length + this.bonus);

    }

    /**
     * @method getAge
     * Return the number of second since the game has started or -1 if it hasn't started yet
     */

    getAge() {
        var now = moment();
        var time_now = now.format('x');
        if (this.timestamp > 0) {
            return (time_now - this.timestamp);
        } else {
            return -1;
        }
    }

    /**
     * @method checkTriangleBalance
     * Returns true if the triangle is still balanced, false otherwise
     */

    checkTriangleBalance() {
        return (this.triangle.getInbalance() < this.flip_treshold);
    }


    /**
     * @method throwThreeSideDice
     * Returns F, S or G depending on the sender and some higher power
     */

    throwThreeSideDice(sender) {

        var random_side = Math.floor(Math.random() * 3 - 1); // 1, 2 or 3
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
     * @method restoreSaved
     * Restores object from saved data
     */

    restoreSaved(data) {
        for (var property in data) {
            if (data.hasOwnProperty(property)) {
                this[property] = data[property]
            }
        }
        this.triangle = new TritsTriangle(data.triangle.sides.F, data.triangle.sides.S, data.triangle.sides.G);
    }

    /**
     * @method getGameStatus
     * Returns the game entire game status 
     */

    getGameStatus() {
        return {
            'board': this.board,
            'timestamp': this.timestamp,
            'bets': this.bets,
            'status': this.status,
            'flip_treshold': this.flip_treshold,
            'nominal': this.nominal,
            'last_player': this.last_player,
            'bonus': this.bonus
        };
    }
}
module.exports = TritsGame;