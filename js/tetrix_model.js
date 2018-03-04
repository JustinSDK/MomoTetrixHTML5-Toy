function block(x, y) {
    return {x, y};
}

function freeze_block(x, y) {
    return Object.freeze({x, y});
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
                            
class TetrixPiece {
    constructor(type, freeze = false) {
        this.type = type;
        if(freeze) {
            this.blocks = Object.freeze(BLOCKS[type].map(b => freeze_block(b.x, b.y)));
            Object.freeze(this);
        } else {
            this.blocks = BLOCKS[type].map(b => block(b.x, b.y));
        }
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

TetrixPiece.TYPE = Object.freeze({
    Z: 0,
    S: 1,
    I: 2,
    J: 3,
    O: 4,
    T: 5,
    L: 6,
});

TetrixPiece.FREEZE = Object.freeze({
    Z: new TetrixPiece(TetrixPiece.TYPE.Z, freeze = true),
    S: new TetrixPiece(TetrixPiece.TYPE.S, freeze = true),
    I: new TetrixPiece(TetrixPiece.TYPE.I, freeze = true),
    J: new TetrixPiece(TetrixPiece.TYPE.J, freeze = true),
    O: new TetrixPiece(TetrixPiece.TYPE.O, freeze = true),
    T: new TetrixPiece(TetrixPiece.TYPE.T, freeze = true),
    L: new TetrixPiece(TetrixPiece.TYPE.L, freeze = true)
});

Object.freeze(TetrixPiece);

