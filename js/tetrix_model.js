class TetrixPiece {
    constructor(type) {
        this.blocks = BLOCKS[type].map(b => block(b.x, b.y));
    }

    rotateLeft() {
        for(let i = 0; i < 4; i++) {
            let x = this.getBlockYCoord(i);
            let y = -this.getBlockXCoord(i);  
            this.setBlockCoord(i, x, y);
        }
    };

    rotateRight() {
        for(let i = 0; i < 4; i++) {
            let x = -this.getBlockYCoord(i);
            let y = this.getBlockXCoord(i);
            this.setBlockCoord(i, x, y);
        }
    };
    
    getBlockXCoord(i) {
         return this.blocks[i].x;
    };
  
    getBlockYCoord(i) {
        return this.blocks[i].y;
    };

    getMinX() {
        return this.blocks.map(b => b.x)
                          .reduce((acc, x) => acc > x ? x : acc);
    };

    getMaxX() {
        return this.blocks.map(b => b.x)
                          .reduce((acc, x) => acc < x ? x : acc);
    };

    getMinY() {
        return this.blocks.map(b => b.y)
                          .reduce((acc, y) => acc > y ? y : acc);
    };

    getMaxY() {
        return this.blocks.map(b => b.y)
                          .reduce((acc, y) => acc < y ? y : acc);       
    };

    setBlockXCoord(i, value) {
        this.blocks[i].x = value;
    };

    setBlockYCoord(i, value) {
        this.blocks[i].y = value;
    };

    setBlockCoord(i, x, y) {
        this.blocks[i].x = x;
        this.blocks[i].y = y;
    };
}

TetrixPiece.Z = 0;
TetrixPiece.S = 1;
TetrixPiece.I = 2;
TetrixPiece.J = 3;
TetrixPiece.O = 4;
TetrixPiece.T = 5;
TetrixPiece.L = 6;

function block(x, y) {
    return {x, y};
}

// seven types of pieces
const BLOCKS = [
    [block( 0, -1), block(0,  0), block(-1, 0), block(-1, 1)],
    [block( 0, -1), block(0,  0), block( 1, 0), block( 1, 1)], 
    [block( 0, -1), block(0,  0), block( 0, 1), block( 0, 2)], 
    [block(-1,  0), block(0,  0), block( 1, 0), block( 0, 1)],
    [block( 0,  0), block(1,  0), block( 0, 1), block( 1, 1)],
    [block(-1, -1), block(0, -1), block( 0, 0), block( 0, 1)],
    [block( 1, -1), block(0, -1), block( 0, 0), block( 0, 1)]
];
                            

              