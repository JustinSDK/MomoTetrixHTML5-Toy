class TetrixPiece {
    constructor(type) {
        this.blocks = TetrixPiece.blocks[type]
                                 .reduce((acc, block) => acc.concat([block.concat()]), []);
    }

    rotateLeft() {
        for(let i = 0; i < 4; i++) {
            let tmp = this.getBlockXCoord(i);  
            this.setBlockXCoord(i, this.getBlockYCoord(i));
            this.setBlockYCoord(i, -tmp);
        }
    };

    rotateRight() {
        for(let i = 0; i < 4; i++) {
            let tmp = this.getBlockXCoord(i);
            this.setBlockXCoord(i, -this.getBlockYCoord(i));
            this.setBlockYCoord(i, tmp);
        }
    };
    
    getBlockXCoord(index) {
         return this.blocks[index][0];
    };
  
    getBlockYCoord(index) {
        return this.blocks[index][1];
    };

    getMinX() {
        let tmp = this.blocks[0][0];
        for(let i = 1 ; i < 4 ; i++) {
            if(tmp > this.blocks[i][0]) {
                tmp = this.blocks[i][0];
            }
        }
        return tmp;
    };

    getMaxX() {
        let tmp = this.blocks[0][0];
        for(let i = 1 ; i < 4 ; i++) {
            if(tmp < this.blocks[i][0]) {
                tmp = this.blocks[i][0];
            }
        }
        return tmp;
    };

    getMinY() {
        let tmp = this.blocks[0][1];
        for(let i = 1; i < 4; i++) {
            if(tmp > this.blocks[i][1]) {
                tmp = this.blocks[i][1];
            }
        }
        return tmp;
    };

    getMaxY() {
        let tmp = this.blocks[0][1];
        for(let i = 1; i < 4; i++) {
            if (tmp < this.blocks[i][1]) {
                tmp = this.blocks[i][1];
            }
        }
        return tmp;
    };

    setBlockXCoord(index, value) {
        this.blocks[index][0] = value;
    };

    setBlockYCoord(index, value) {
        this.blocks[index][1] = value;
    };

    setBlockCoord(index, x, y) {
        this.blocks[index][0] = x;
        this.blocks[index][1] = y;
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
              