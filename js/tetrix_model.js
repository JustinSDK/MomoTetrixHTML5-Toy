function TetrixPiece(type) {
    type = type || parseInt(Math.random() * 7 + 1);
    
    var pieceType = 0;
    var coordinates = [];
    for(var i = 0; i < 4; i++) {
        coordinates[i] = [];
    }
    
    this.initialize = function(type) {
        if (type < 1 || type > 7) {
            type = 1;
        }
        // set coord. for each block
        pieceType = type;
        for(var i = 0 ;i < 4 ;i++) {
            coordinates[i][0] = TetrixPiece.pieceTypes[pieceType - 1][i][0];
            coordinates[i][1] = TetrixPiece.pieceTypes[pieceType - 1][i][1];
        }
    };
    
    this.initialize(type);

    this.rotateLeft = function() {
        // do not rotate square piece
        if(pieceType == 5) {
            return;
        }
        var tmp;
        for(var i = 0; i < 4; i++) {
            tmp = this.getBlockXCoord(i);  
            this.setBlockXCoord(i, this.getBlockYCoord(i));
            this.setBlockYCoord(i, -tmp);
        }
    };

    this.rotateRight = function() {
        // do not rotate square piece
        if(pieceType == 5) {
            return;
        }
        var tmp;
        for(var i = 0; i < 4; i++) {
            tmp = this.getBlockXCoord(i);
            this.setBlockXCoord(i, -this.getBlockYCoord(i));
            this.setBlockYCoord(i, tmp);
        }
    };
    
    // get the type of piece
    this.getType = function() {
        return pieceType;
    };
    
    this.getBlockXCoord = function(index) {
         return coordinates[index][0];
    };
  
    this.getBlockYCoord = function(index) {
        return coordinates[index][1];
    };

    this.getMinX = function() {
        var tmp = coordinates[0][0];
        for(var i = 1 ; i < 4 ; i++) {
            if(tmp > coordinates[i][0]) {
                tmp = coordinates[i][0];
            }
        }
        return tmp;
    };

    this.getMaxX = function() {
        var tmp = coordinates[0][0];
        for(var i = 1 ; i < 4 ; i++) {
            if(tmp < coordinates[i][0]) {
                tmp = coordinates[i][0];
            }
        }
        return tmp;
    };

    this.getMinY = function() {
        var tmp = coordinates[0][1];
        for(var i = 1; i < 4; i++) {
            if(tmp > coordinates[i][1]) {
                tmp = coordinates[i][1];
            }
        }
        return tmp;
    };

    this.getMaxY = function() {
        var tmp = coordinates[0][1];
        for(var i = 1; i < 4; i++) {
            if (tmp < coordinates[i][1]) {
                tmp = coordinates[i][1];
            }
        }
        return tmp;
    };

    this.setBlockXCoord = function(index, value) {
        coordinates[index][0] = value;
    };

    this.setBlockYCoord = function(index, value) {
        coordinates[index][1] = value;
    };

    this.setBlockCoord = function(index, x, y) {
        coordinates[index][0] = x;
        coordinates[index][1] = y;
    };
}

// seven types of pieces
TetrixPiece.pieceTypes = [[[ 0,-1],
                           [ 0, 0],
                           [-1, 0],
                           [-1, 1]],
                             
                          [[ 0,-1],
                           [ 0, 0],
                           [ 1, 0],
                           [ 1, 1]],

                          [[ 0,-1],
                           [ 0, 0],
                           [ 0, 1],
                           [ 0, 2]],

                           [[-1, 0],
                            [ 0, 0],
                            [ 1, 0],
                            [ 0, 1]],

                           [[ 0, 0],
                            [ 1, 0],
                            [ 0, 1],
                            [ 1, 1]],

                           [[-1,-1],
                            [ 0,-1],
                            [ 0, 0],
                            [ 0, 1]],

                           [[ 1,-1],
                            [ 0,-1],
                            [ 0, 0],
                            [ 0, 1]]];
                            
class RGB {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    toString() {
        return `RGB(${this.r}, ${this.g}, ${this.b})`;
    };
}                            