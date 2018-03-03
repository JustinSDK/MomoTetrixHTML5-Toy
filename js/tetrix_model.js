function TetrixPiece(type) {

    let blocks = TetrixPiece.blocks[type].reduce((acc, block) => acc.concat([block.concat()]), []);

    this.rotateLeft = function() {
        // do not rotate O piece
        if(type == TetrixPiece.O) {
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
        // do not rotate O piece
        if(type == TetrixPiece) {
            return;
        }
        var tmp;
        for(var i = 0; i < 4; i++) {
            tmp = this.getBlockXCoord(i);
            this.setBlockXCoord(i, -this.getBlockYCoord(i));
            this.setBlockYCoord(i, tmp);
        }
    };
    
    this.getBlockXCoord = function(index) {
         return blocks[index][0];
    };
  
    this.getBlockYCoord = function(index) {
        return blocks[index][1];
    };

    this.getMinX = function() {
        var tmp = blocks[0][0];
        for(var i = 1 ; i < 4 ; i++) {
            if(tmp > blocks[i][0]) {
                tmp = blocks[i][0];
            }
        }
        return tmp;
    };

    this.getMaxX = function() {
        var tmp = blocks[0][0];
        for(var i = 1 ; i < 4 ; i++) {
            if(tmp < blocks[i][0]) {
                tmp = blocks[i][0];
            }
        }
        return tmp;
    };

    this.getMinY = function() {
        var tmp = blocks[0][1];
        for(var i = 1; i < 4; i++) {
            if(tmp > blocks[i][1]) {
                tmp = blocks[i][1];
            }
        }
        return tmp;
    };

    this.getMaxY = function() {
        var tmp = blocks[0][1];
        for(var i = 1; i < 4; i++) {
            if (tmp < blocks[i][1]) {
                tmp = blocks[i][1];
            }
        }
        return tmp;
    };

    this.setBlockXCoord = function(index, value) {
        blocks[index][0] = value;
    };

    this.setBlockYCoord = function(index, value) {
        blocks[index][1] = value;
    };

    this.setBlockCoord = function(index, x, y) {
        blocks[index][0] = x;
        blocks[index][1] = y;
    };
}

TetrixPiece.Z = 0;
TetrixPiece.S = 1;
TetrixPiece.I = 2;
TetrixPiece.J = 3;
TetrixPiece.O = 4;
TetrixPiece.T = 5;
TetrixPiece.L = 6;

// seven types of pieces
TetrixPiece.blocks = [
    [[ 0,-1], [ 0, 0], [-1, 0], [-1, 1]],
    [[ 0,-1], [ 0, 0], [ 1, 0], [ 1, 1]], 
    [[ 0,-1], [ 0, 0], [ 0, 1], [ 0, 2]], 
    [[-1, 0], [ 0, 0], [ 1, 0], [ 0, 1]],
    [[ 0, 0], [ 1, 0], [ 0, 1], [ 1, 1]],
    [[-1,-1], [ 0,-1], [ 0, 0], [ 0, 1]],
    [[ 1,-1], [ 0,-1], [ 0, 0], [ 0, 1]]
];
                            
function rgb(r, g, b) {
    return `rgb(${r}, ${g}, ${b})`;
}
              