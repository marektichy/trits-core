'use strict';


var TritsGame = require('./lib/trits-core.js');
var TritsTriangle = require('./lib/trits-triangle.js');


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
console.log(rewards);