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
        this.blocks.forEach(block => {
            let x = block.y;
            let y = -block.x;  
            block.x = x;
            block.y = y;
        });
    };

    rotateRight() {
        this.blocks.forEach(block => {
            let x = -block.y;
            let y = block.x;  
            block.x = x;
            block.y = y;
        });        
    };
    
    xOfBlock(i) {
         return this.blocks[i].x;
    };
  
    yOfBlock(i) {
        return this.blocks[i].y;
    };

    get minimumX() {
        return this.blocks.map(b => b.x)
                          .reduce((acc, x) => acc > x ? x : acc);
    };

    get maximumX() {
        return this.blocks.map(b => b.x)
                          .reduce((acc, x) => acc < x ? x : acc);
    };

    get minimumY() {
        return this.blocks.map(b => b.y)
                          .reduce((acc, y) => acc > y ? y : acc);
    };

    get maximumY() {
        return this.blocks.map(b => b.y)
                          .reduce((acc, y) => acc < y ? y : acc);       
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

const pieces = [
    TetrixPiece.FREEZE.Z, 
    TetrixPiece.FREEZE.S,  
    TetrixPiece.FREEZE.I,  
    TetrixPiece.FREEZE.J, 
    TetrixPiece.FREEZE.O, 
    TetrixPiece.FREEZE.T, 
    TetrixPiece.FREEZE.L 
];
function randomFreezePiece() {
    let index = parseInt(Math.random() * 7);
    return pieces[index];
}

function TetrixGround(xblocks = 10, yblocks = 20) { 
    let ground = Array(xblocks)
                   .fill()
                   .map(_ => Array(yblocks).fill(0));
        
    let xOffset = parseInt(xblocks / 2) - 1;
    let yOffset = 1;
    
    let emptyLines = 0;
    let removedLines = 0;
    let score = 0;
    
    let isGameover = false;
    let isOperable = true;

    let tetrixPiece;
    let testPiece;

    this.isMovable = function(xStep, yStep) {
        return tetrixPiece.blocks.every(block => {
            let x = block.x + xOffset + xStep;
            let y = block.y + yOffset + yStep;
            return x >= 0 && x < xblocks && y < yblocks && ground[x][y] == 0;
        });
    };
    
    this.addPieceOfType = function(pieceType) {
        tetrixPiece = new TetrixPiece(pieceType);
        testPiece = new TetrixPiece(pieceType);    
        xOffset = xblocks / 2 - 1;
        yOffset = tetrixPiece.minimumY < 0 ? Math.abs(tetrixPiece.minimumY) : 0;
        isGameover = tetrixPiece.blocks.some(block => {
            let x = block.x + xOffset;
            let y = block.y + yOffset;
            return ground[x][y] != 0;
        });
    };
    
    this.reset = function() {
        emptyLines = 0;
        score = 0;
        removedLines = 0;
        isGameover = false; 
        isOperable = true;
        
        xOffset = parseInt(xblocks / 2) - 1;
        yOffset = tetrixPiece.maximumY < 0 ? Math.abs(tetrixPiece.minimumY) : 0;
        
        ground = Array(xblocks)
                   .fill()
                   .map(_ => Array(yblocks).fill(0));
    };
    
    this.moveTetrixLeft = function() {
        if(this.isMovable(-1, 0)) {
            xOffset--;
        }
    };

    this.moveTetrixRight = function() {
        if(this.isMovable(1, 0)) {
            xOffset++;
        }
    };

    this.moveTetrixDown = function() {
        if(this.isMovable(0, 1) && isOperable) { 
            yOffset++; 
        }
    };

    this.dropTetrix = function() {
        while(this.isMovable(0, 1) && isOperable) {
            yOffset++;
        }
    };

    this.rotateTetrix = function(clockwise) {
        testPiece.blocks.forEach((block, i) => {
            block.x = tetrixPiece.blocks[i].x;
            block.y = tetrixPiece.blocks[i].y;
        });

        if(clockwise) {
            testPiece.rotateRight();
        }
        else {
            testPiece.rotateLeft();
        }

        let rotatable = testPiece.blocks.every(block => {
            let x = block.x + xOffset;
            let y = block.y + yOffset;
            return x >= 0 && x < xblocks && y < yblocks && y >= 0 && ground[x][y] == 0;
        });
       
        if(rotatable) {
            tetrixPiece.blocks.forEach((block, i) => {
                block.x = testPiece.blocks[i].x;
                block.y = testPiece.blocks[i].y;
            });
        }
    };
    
    this.updateGround = function() {
        isOperable = false;
        
        if(!isGameover && !this.isMovable(0, 1)) {
            // touch the bottom of playground or the top of one piece 
            tetrixPiece.blocks.forEach(block => {
                let x = block.x + xOffset;
                let y = block.y + yOffset;
                ground[x][y] = tetrixPiece.type + 1;
            });
            
            let pieceTop = tetrixPiece.minimumY + yOffset;
            if(pieceTop < emptyLines) {
                emptyLines = pieceTop;
            }
        
            removeFullLines();
        }
        
        isOperable = true;
    };
    
    function isFullLine(j) {
        for(let i = 0; i < xblocks; i++) {
            if(ground[i][j] == 0) {
                return false;
            }
        }
        return true;
    }

    function cleanLine(j) {
        // move lines down
        for(let k = j; k > emptyLines; k--) {
            for(let i = 0; i < xblocks; i++) {
                if(ground[i][k] != ground[i][k-1]) {
                    ground[i][k] = ground[i][k-1];
                }
            }
        }
        
        // clean top line
        for(let i = 0; i < xblocks; i++) {
            ground[i][emptyLines] = 0;
        }        
    }

    function removeFullLines() {
        let count = 0;
        for(let j = yblocks - 1; j > emptyLines; j--) {
            if(isFullLine(j)) {
                cleanLine(j);
                emptyLines++;
                removedLines++;
                count++;
                j++;
            }
        }
        
        score = score + parseInt(Math.pow(2, count));
    };
    
    this.getGroundHeightInBlk = function() {
        return yblocks;
    };
    
    this.getGroundWidthInBlk = function() {
        return xblocks;
    };
    
    this.getTetrixPiece = function() {
        return tetrixPiece;
    };
    
    this.setTetrixPiece = function(tetrixPiece) {
        tetrixPiece = tetrixPiece;
    };
    
    this.getGroundInfo = function() {
        return ground;
    };
    
    this.isGameover = function() {
        return isGameover;
    };
    
    this.getScore = function() {
        return score;
    };
    
    this.getRemovedLines = function() {
        return removedLines;
    };
    
    this.getXOffset = function() {
        return xOffset;
    };
    
    this.getYOffset = function() {
        return yOffset;
    };
}