# Trits Core

The trits-core npm package contains the TritsGame class which implements The Trits game rules.


## How to install

To install this package, run

> npm install trits-core

## How to use

To use the TritsGame class in you code, add

> var tritsGame = require("trits-core");

About The Trits Game
====================

The Trits is a fully transparent, <a href="https://en.wikipedia.org/wiki/Zero-sum_game" target="_blank">zero-sum</a> and  <a href="https://cs.wikipedia.org/wiki/House_Edge" target="_blank">zero-edge</a> casino game designed for the <a href="https://iota.org/" target="_blank">IOTA cryptocurrency</a>. It can be played either by humans and machines. It aims to demonstrate the possibilities of <a href="http://tangle.glumb.de/" target="_blank">the Tangle</a>, while still being fun and thrill.

The game itself was conceived as a humble honor to the memory of <a href="https://www.youtube.com/watch?v=oM1SflhJDoc" target="_blank">John Forbes Nash Jr</a> and is a cross-breed between a <a href="https://en.wikipedia.org/wiki/Medal_game#Pusher_gamex_type" target="_blank">coin pusher</a> and a <a href="https://en.wikipedia.org/wiki/Fidget_spinner" target="_blank">fidget spinner</a>.

<a href = "https://ia601506.us.archive.org/32/items/example_20171018/example.png"><img src="https://archive.org/download/spinner_middle/spinner_middle.png"/></a>


Once the game has been started, there is a pile of coins in the middle of the spinner. The ultimate aim of the game is to disturb the spinner balance by placing a coin on the spinner arms. However, each coin placement is determined by a throw of a “three-sided dice”.

<img src="https://archive.org/download/trits_logo_middle/trits_logo_middle.png"/>

The spinner loses balance and flips when the number of coins on one side outnumbers the number of coins on any other arm **by three**. A loss of the spinner balance finishes the game immediately and determines the winner. 

But of course, there is a gotcha. One of the arms belongs to the "evil" Bank and when this arm happens to be the winning arm, the Bank takes it all. The good news is – the Bank uses it solely for funding new games in the future. In other words, the Bank just looks after the "progressive jackpot", so you can always have a chance to win back what you might have lost.

Game rules
==========

Some terms explained first:

**Bank** – the treasurer of coins lost in previous games, used mostly for adding a bonus to each game. The Bank never participates in the games as a player itself, but it can seed new games.

**Initiator (Seeder)** – is the player who started the game by placing the first coin

**Coin** – a single token used in the game

**Nominal** – the nominal value of one coin in IOTAs. The nominal is set at the very beginning of each game by the amount of IOTAs sent with the first transaction

**Total** – the total value of all the coins on the table.

**Spinner arms** – the spinner has three arms (as spinners do) marked by letters and the center marked by **I (i**nitial). One of the arms belongs to the Bank - which one is revealed once the game finishes. 

**The winning arm** – the spinner arm on which the last coin in the game has been placed

**The Winner** – the player who has placed the last coin on the winning arm

**Game address** – each game has a unique IOTA address.

### Staring the game

Anybody can start/seed the game by placing a single coin in the middle (i.e. sending the first IOTA transaction to the empty game address). This sets the nominal and starts the game. The coin will be placed on the **I** spot in the middle.

### Bonus

The moment a new game is seeded, the bank is obliged to add four or five coins on the **I** spot. This happens always, unless the Bank balance is too low. The current Bank balance is publicly announced.

### Playing the game

You play the game by throwing your coins into it (i.e. sending the IOTA transaction with the same nominal value to the game address). The game runs **until** the difference between the sides with the lowest and highest number of coins reaches exactly **3** (three) coins.

### Finishing the game

The game is finished at the very moment the last coin which causes the **3-coin** difference is placed on the spinner. The side on which the last coin has been placed determines the winning arm.

Note: A game can come to an end also by expiring – games not finished within 24 hours will expire and all the transactions are fully reimbursed.

### Distributing the winnings

1\) If the winning arm belongs to the bank, the entire total goes to the **Bank**

**OR**

2\) The triple of the nominal is send to the seeder

3\) The rest on the table goes to the winner

The Bank and the Dashboard
==========================

The Trits game is fully transparent - meaning that each game can be completely backtracked by inspecting the IOTA Tangle. The assignment of the Bank's arm and dice throws are done in a <a href="https://en.wikipedia.org/wiki/Provably_fair">provably fair</a> manner.

The Bank maintains the incentives – it keeps the game going. It’s not there to make a profit.

There are always 23 (John Nash's favourite prime number) tables named after biggest cities on which the Trits game can be played, and their status is displayed on the public dashboard. The 24th called Atlanta is a sandbox. The Bank’s role is to keep them all active by adding the bonus, and if necessary, by seeding new games.

Good Luck
=======

Your odds of winning in The Trits game are the theoretical maximum. The house edge is zero, while the wins at the individual games can be quite high. Even if you loose, just initiate a new game and watch - you have got a 66% chance of tripling your bet. That's **33% profit guaranteed***  - a money printing machine dream come true :-). 

If you have to gamble, this is your safest home.

* *(when done long enough)*


