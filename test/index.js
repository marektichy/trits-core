
var assert = require('assert');
var path = require('path');
var TritsTriangle = require(path.join(__dirname, '..', 'lib/trits-triangle.js'));
var TritsGame = require(path.join(__dirname, '..', 'lib/trits-core.js'));

const TRITS_GAME_BANK_ID = 'BANK99999999999999999999999999999999999999999999999999999999999999999999999999999';
const TRITS_GAME_FEE_ID = 'FEES99999999999999999999999999999999999999999999999999999999999999999999999999999';

describe('class TritsGame', function(){
    describe('TritsGame.constructor()', function(){
        it('Should initialize game state to -1, total should be 0', function(){
            var t = new TritsGame ("London");
            var status = t.getGameStatus();
            var total = t.getTotal();
            assert.equal(status.status, -1);
            assert.equal(total, 0);
        })
    });
    describe('TritsGame.putBet(30,"Neo")', function(){
        it('Should change game status to 0, total 30, -30 deducted from Neo', function(){
            var t = new TritsGame ("London");
            var res = t.putBet(30,'Neo');
            var status = t.getGameStatus();
            var total = t.getTotal();
            assert.equal(status.status, 0);
            assert.equal(total, 30);
            assert.equal(res, -30);
        })
    });
    describe('TritsGame.putBonus(5) after putBet(30,"Neo");', function(){
        it('Should add 5 coins in the middle, total 180', function(){
            var t = new TritsGame ("London");
            t.putBet(30,'Neo');
            res = t.putBonus(5);
            var total = t.getTotal();
            assert.equal(total, 180);
            assert.equal(res, -150);
        })
    });
    describe('TritsGame.putBet(35,"Trinity") after putBet(30,"Neo") and bonus;', function(){
        it('Should refuse the bet, total 180', function(){
            var t = new TritsGame ("London");
            t.putBet(30,'Neo');
            t.putBonus(5);
            var res = t.putBet(35,'Trinity');
            var total = t.getTotal();
            assert.equal(total, 180);
            assert.equal(res, 0);
        })
    });
    describe('Trinity plays alone three times with a dice fixed on F;', function(){
        it('She should be the winner of the game', function(){
            class FixedTritsGame extends TritsGame {throwThreeSideDice() {return 'F';}}
            var t = new FixedTritsGame ("London");
            t.putBet(30,'Neo');
            t.putBonus(5);
            t.putBet(30,'Trinity');
            t.putBet(30,'Trinity');
            var res = t.putBet(30,'Trinity');
            var status = t.getGameStatus();
            var total = t.getTotal();
            assert.equal(status.status, 1);
            assert.equal(total, 270);
            assert.equal(res, -30);
        })
    });
    describe('Rewards - Trinity plays with a dice fixed on G', function(){
        it(' The Bank should be taking it all', function(){
            class FixedTritsGame extends TritsGame {throwThreeSideDice() {return 'G';}}
            var t = new FixedTritsGame ("London");
            t.putBet(10,'Neo');
            t.putBet(10,'Trinity');
            t.putBet(10,'Trinity');
            t.putBet(10,'Trinity');
            var total = t.getTotal();
            var status = t.getGameStatus();
            var rewards = t.getRewardsTable();
            assert.equal(status.status, 1);
            assert.equal(total, 40);
            assert.equal(rewards[TRITS_GAME_BANK_ID], 40);
        })
    });
    describe('Rewards - Multiplayer on a fixed dice sequence', function(){
        it(' Various things should happen ', function(){
            TritsGame.prototype.throwThreeSideDice = function () {
                if ( typeof TritsGame.prototype.throwThreeSideDice.i == 'undefined' ) { TritsGame.prototype.throwThreeSideDice.i = 0;}
                var sequence = ['F','F','G','S','G','S','S','G','S','S','F','S'];
                return sequence[TritsGame.prototype.throwThreeSideDice.i++];
            };
            var t = new TritsGame ("London");
            t.putBet(10,'Neo');
            t.putBonus(5);
            t.putBet(10,'Trinity');  //F
            t.putBet(10,'Morpheus'); //F
            t.putBet(10,'Morpheus'); //G
            t.putBet(10,'Tank'); // S
            t.putBet(10,'Cypher'); // G
            t.putBet(14,'Trinity');
            t.putBet(10,'Tank'); // S
            t.putBet(10,'Tank'); // S
            t.putBet(10,'Tank'); // G
            t.putBet(10,'Tank'); // S
            t.putBet(10,'Cypher'); // S
            t.putBet(10,'Trinity'); // F - game over
            t.putBet(10,'Trinity'); // S - game over
            var total = t.getTotal();
            var status = t.getGameStatus();
            var rewards = t.getRewardsTable();
            assert.equal(status.status, 1);
            assert.equal(total, 160);
            assert.equal(rewards[TRITS_GAME_BANK_ID], undefined );
            assert.equal(rewards['Neo'], 30 );
            assert.equal(rewards['Tank'], 40 );
        })
    });
    describe('Rewards - fees and nominal lowering', function(){
        it('', function(){
            TritsGame.prototype.throwThreeSideDice = function () {
                if ( typeof TritsGame.prototype.throwThreeSideDice.i == 'undefined' ) { TritsGame.prototype.throwThreeSideDice.i = 0;}
                var sequence = ['S','F','S','S'];
                return sequence[TritsGame.prototype.throwThreeSideDice.i++];
            };
            var t = new TritsGame ("London");
            t.putBet(10,'Trinity');
            t.putBet(10,'Neo');  //S
            t.putBet(10,'Neo'); //F
            t.putBet(10,'Neo'); //S
            t.putBet(10,'Neo'); // S
            var total = t.getTotal();
            var status = t.getGameStatus();
            var rewards = t.getRewardsTable();
            assert.equal(status.status, 1);
            assert.equal(total, 50);
            assert.equal(rewards[TRITS_GAME_BANK_ID], undefined );
            assert.equal(rewards['Neo'], 18 );
            assert.equal(rewards[TRITS_GAME_FEE_ID], 2 );
            assert.equal(rewards['Trinity'], 30 );
        })
    });
});

TritsGame.prototype.throwThreeSideDice = function () {
    if ( typeof TritsGame.prototype.throwThreeSideDice.i == 'undefined' ) { TritsGame.prototype.throwThreeSideDice.i = 0;}
    var sequence = ['F','F','G','S','G','S','S'];
    return sequence[TritsGame.prototype.throwThreeSideDice.i++];
};

describe('class TritsTriangle', function(){
    describe('TritsTriangle.getInbalance()', function(){
        it('Should return 3 when sides have been hit [1,2,4]', function(){
            var t = new TritsTriangle (0, 0, 0);
            t.hitSide('S');
            t.hitSide('S');
            t.hitSide('G');
            t.hitSide('G');
            t.hitSide('F');
            t.hitSide('G');
            t.hitSide('G');
            assert.equal(t.getInbalance(), 3);
        })
    });
    describe('TritsTriangle.getWinningSide()', function(){
        it('Should return S when sides have been hit  [2,0,1]', function(){
            var t = new TritsTriangle (0, 0, 0);
            t.hitSide('F'); t.hitSide('G'); t.hitSide('F');
            assert.equal(t.getWinningSide(), 'F');
        })
    });

    describe('Restore from saved data', function(){
        it('Should restore the object correctly from saved data', function(){
            var tg = new TritsGame('koko');
            tg.restoreSaved({
                board: 'LAGOS9999999999999999999999999999999999999999999999999999999999999999999999999999',
                bets: { I: 'NEO', F: ['Trinity'], S: ['Neo','Neo'], G: [] },
                status: 0,
                flip_treshold: 3,
                nominal: 20,
                triangle: { sides: { F: 1, S: 2, G: 0 } },
                bonus: 5,
                last_player: 'Neo' }
            );
            assert.equal(tg.getTotal(), 180);
            assert.equal(tg.triangle.getWinningSide(), 'S');
        })
    });
});

