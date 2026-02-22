'use strict';

var besogo = besogo || {};
besogo.rules = besogo.rules || {};

// Color constants (matching gameRoot.js)
var BLACK = -1;
var WHITE = 1;
var EMPTY = 0;

// Go rules
besogo.rules.go = {
    name: 'go',
    displayName: '围棋',
    
    validateMove: function(board, x, y, color, sizeX, sizeY) {
        var current = board['board' + x + '-' + y];
        if (current) {  // Position not empty
            return { valid: false, reason: 'Position occupied' };
        }
        return { valid: true, reason: null };
    },
    
    applyMove: function(board, x, y, color, sizeX, sizeY) {
        // Go capture logic handled in gameRoot.js
        return { captures: [], ko: null };
    },
    
    checkWin: function(board, x, y, color, sizeX, sizeY) {
        // Go has no win detection
        return { won: false, winner: null, winLine: null };
    }
};

// Gomoku rules (5-in-a-row, no forbidden moves)
besogo.rules.gomoku = {
    name: 'gomoku',
    displayName: '无禁手五子棋',
    
    validateMove: function(board, x, y, color, sizeX, sizeY) {
        var current = board['board' + x + '-' + y];
        if (current) {  // Position not empty
            return { valid: false, reason: 'Position occupied' };
        }
        return { valid: true, reason: null };
    },
    
    applyMove: function(board, x, y, color, sizeX, sizeY) {
        // No captures in Gomoku
        return { captures: [], ko: null };
    },
    
    checkWin: function(board, x, y, color, sizeX, sizeY) {
        var directions = [
            {dx: 1, dy: 0},
            {dx: 0, dy: 1},
            {dx: 1, dy: 1},
            {dx: 1, dy: -1}
        ];
        
        for (var d = 0; d < directions.length; d++) {
            var dir = directions[d];
            var line = [{x: x, y: y}];
            
            var i = 1;
            while (true) {
                var nx = x + dir.dx * i;
                var ny = y + dir.dy * i;
                if (nx < 1 || nx > sizeX || ny < 1 || ny > sizeY) break;
                if (board['board' + nx + '-' + ny] !== color) break;
                line.push({x: nx, y: ny});
                i++;
            }
            
            i = 1;
            while (true) {
                var nx = x - dir.dx * i;
                var ny = y - dir.dy * i;
                if (nx < 1 || nx > sizeX || ny < 1 || ny > sizeY) break;
                if (board['board' + nx + '-' + ny] !== color) break;
                line.unshift({x: nx, y: ny});
                i++;
            }
            
            if (line.length >= 5) {
                return {won: true, winner: color, winLine: line};
            }
        }
        
        return {won: false, winner: null, winLine: null};
    }
};

// Free play rules (no restrictions)
besogo.rules.free = {
    name: 'free',
    displayName: '自由落子',
    
    validateMove: function(board, x, y, color, sizeX, sizeY) {
        var current = board['board' + x + '-' + y];
        if (current) {  // Position not empty
            return { valid: false, reason: 'Position occupied' };
        }
        return { valid: true, reason: null };
    },
    
    applyMove: function(board, x, y, color, sizeX, sizeY) {
        // No captures in free play
        return { captures: [], ko: null };
    },
    
    checkWin: function(board, x, y, color, sizeX, sizeY) {
        // No win detection in free play
        return { won: false, winner: null, winLine: null };
    }
};

// Export rule list for dropdown
besogo.rules.list = [besogo.rules.go, besogo.rules.gomoku, besogo.rules.free];
