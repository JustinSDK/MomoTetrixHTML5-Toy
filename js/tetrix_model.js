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
        if(tetrixPiece.minimumY < 0) {
            yOffset = Math.abs(tetrixPiece.minimumY);
        }
        else {
            yOffset = 0;
        }
        
        for(var i = 0; i < 4; i++) {
            var x = tetrixPiece.xOfBlock(i) + xOffset;
            var y = tetrixPiece.yOfBlock(i) + yOffset;

            if(ground[x][y] != 0) {
                isGameover = true;
            }
        }
    };
    
    this.reset = function() {
        emptyLines = 0;
        score = 0;
        removedLines = 0;
        isGameover = false; 
        isOperable = true;
        
        xOffset = parseInt(xblocks / 2) - 1;
        if(tetrixPiece.minimumY < 0) {
            yOffset = Math.abs(tetrixPiece.minimumY);
        }
        else {
            yOffset = 0;
        }
        
        for(var i = 0; i < xblocks; i++) {
            for(var j = 0; j < yblocks; j++) {
                ground[i][j] = 0;
            }
        }
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
        for(var i = 0; i < 4; i++) {
            testPiece.setBlockCoord(i, tetrixPiece.xOfBlock(i), tetrixPiece.yOfBlock(i));
        }

        if(clockwise) {
            testPiece.rotateRight();
        }
        else {
            testPiece.rotateLeft();
        }

        for(var i = 0; i < 4; i++) {
            var x = testPiece.xOfBlock(i) + xOffset;
            var y = testPiece.yOfBlock(i) + yOffset;

            if(x < 0 || x >= xblocks || y >= yblocks || y < 0) {
                return;
            }

            if(ground[x][y] != 0) {
                return;
            }
        } 
       
        for(var i = 0; i < 4; i++) {
            tetrixPiece.setBlockCoord(i, testPiece.xOfBlock(i), testPiece.yOfBlock(i));
        }
    };
    
    this.updateGround = function() {
        isOperable = false;
        
        if(!isGameover && !this.isMovable(0, 1)) {
            // touch the bottom of playground or the top of one piece 
            for(var i = 0; i < 4; i++) {
                var x = tetrixPiece.xOfBlock(i) + xOffset;
                var y = tetrixPiece.yOfBlock(i) + yOffset;
                ground[x][y] = tetrixPiece.type + 1;
            }
        
            var pieceTop = tetrixPiece.minimumY + yOffset;
            if(pieceTop < emptyLines) {
                emptyLines = pieceTop;
            }
        
            removeFullLines();
        }
        
        isOperable = true;
    };
    
    function removeFullLines() {
        var count = 0;
        for(var j = yblocks - 1; j > emptyLines; j--) {
            var isFullLine = true;
            for(var i = 0; i < xblocks; i++) {
                if(ground[i][j] == 0) {
                    isFullLine = false;
                    break;
                }
            }

            if(isFullLine) {
                count++;
                for(var k = j; k > emptyLines; k--) {
                    for(var i = 0; i < xblocks; i++) {
                        if(ground[i][k] != ground[i][k-1]) {
                            ground[i][k] = ground[i][k-1];
                        }
                    }
                }
                
                for(var i = 0; i < xblocks; i++) {
                    ground[i][emptyLines] = 0;
                }
                emptyLines++;
                j++;
                
                removedLines++;
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