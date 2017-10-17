"use strict";

class TritsTriangle {

    constructor (F, S, G) {
        this.sides = {};
        this.sides.F = F || 0;
        this.sides.S = S || 0;
        this.sides.G = G || 0;
    }

    /**
     * @method hitSide
     * Add one coin on one tringle vertice
     */

    hitSide(s) {
        this.sides[s]++;
    }

    /**
     * @method getInbalance
     * Calculate the max difference between the highest and lowest vertices
     */

    getInbalance()
    {
        var sides_array = [this.sides.F, this.sides.S, this.sides.G];
        var min = sides_array.reduce(function(a, b) {
            return Math.min(a, b);
        });
        var max = sides_array.reduce(function(a, b) {
            return Math.max(a, b);
        });
        return max - min;
    }

    /**
     * @method getWinningSide
     * Calculate the winning side - the one which has a max number of coins
     */

    getWinningSide()
    {
        var out = false;
        var sides = {F : this.sides.F, S: this.sides.S, G: this.sides.G};
        var sides_array = [this.sides.F, this.sides.S, this.sides.G];
        var max = sides_array.reduce(function(a, b) {
            return Math.max(a, b);
        });
        Object.keys(sides).forEach(function(key) {
            if (sides[key] == max) {
                out = key;
            }
        });
        return out;
    }
};

module.exports =  TritsTriangle;