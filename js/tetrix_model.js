function block(x, y) {
    return { x, y };
}

function freeze_block(x, y) {
    return Object.freeze({ x, y });
}

// seven types of pieces
const BLOCKS = [
    [block(0, -1), block(0, 0), block(-1, 0), block(-1, 1)],
    [block(0, -1), block(0, 0), block(1, 0), block(1, 1)],
    [block(0, -1), block(0, 0), block(0, 1), block(0, 2)],
    [block(-1, 0), block(0, 0), block(1, 0), block(0, 1)],
    [block(0, 0), block(1, 0), block(0, 1), block(1, 1)],
    [block(-1, -1), block(0, -1), block(0, 0), block(0, 1)],
    [block(1, -1), block(0, -1), block(0, 0), block(0, 1)]
];

class TetrixPiece {
    constructor(type, freeze = false) {
        this.type = type;
        if (freeze) {
            this.blocks = Object.freeze(BLOCKS[type].map(b => freeze_block(b.x, b.y)));
            Object.freeze(this);
        } else {
            this.blocks = BLOCKS[type].map(b => block(b.x, b.y));
        }
    }

    rotateCountClockwise() {
        if(this.type === TetrixPiece.TYPE.O) {
            return;
        }        
        this.blocks.forEach(block => {
            let x = block.y;
            let y = -block.x;
            block.x = x;
            block.y = y;
        });
    }

    rotateClockwise() {
        if(this.type === TetrixPiece.TYPE.O) {
            return;
        }
        this.blocks.forEach(block => {
            let x = -block.y;
            let y = block.x;
            block.x = x;
            block.y = y;
        });
    }

    rotate(isClockwise) {
        if(isClockwise) {
            this.rotateClockwise();
        } else {
            this.rotateCountClockwise();
        }
    }

    xOfBlock(i) {
        return this.blocks[i].x;
    }

    yOfBlock(i) {
        return this.blocks[i].y;
    }

    get minimumX() {
        return this.blocks.map(b => b.x)
            .reduce((acc, x) => acc > x ? x : acc);
    }

    get maximumX() {
        return this.blocks.map(b => b.x)
            .reduce((acc, x) => acc < x ? x : acc);
    }

    get minimumY() {
        return this.blocks.map(b => b.y)
            .reduce((acc, y) => acc > y ? y : acc);
    }

    get maximumY() {
        return this.blocks.map(b => b.y)
            .reduce((acc, y) => acc < y ? y : acc);
    }

    static randomFreezePiece() {
        return pieces[parseInt(Math.random() * 7)];
    }
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
    Z: new TetrixPiece(TetrixPiece.TYPE.Z, true),
    S: new TetrixPiece(TetrixPiece.TYPE.S, true),
    I: new TetrixPiece(TetrixPiece.TYPE.I, true),
    J: new TetrixPiece(TetrixPiece.TYPE.J, true),
    O: new TetrixPiece(TetrixPiece.TYPE.O, true),
    T: new TetrixPiece(TetrixPiece.TYPE.T, true),
    L: new TetrixPiece(TetrixPiece.TYPE.L, true)
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

class TetrixGround {
    constructor(xblocks = 10, yblocks = 20) {
        this.xblocks = xblocks;
        this.yblocks = yblocks;
        this.reset();
    }

    isMovable(xStep, yStep) {
        return this.tetrixPiece.blocks.every(block => {
            let x = block.x + this.xOffset + xStep;
            let y = block.y + this.yOffset + yStep;
            return x >= 0 && x < this.xblocks && y < this.yblocks && this.ground[x][y] == 0;
        });
    }

    copyPiece(piece) {
        this.tetrixPiece = new TetrixPiece(piece.type);
        this.testPiece = new TetrixPiece(piece.type);
        this.xOffset = this.xblocks / 2 - 1;
        this.yOffset = this.tetrixPiece.minimumY < 0 ? Math.abs(this.tetrixPiece.minimumY) : 0;
        this.isGameover = this.tetrixPiece.blocks.some(block => {
            let x = block.x + this.xOffset;
            let y = block.y + this.yOffset;
            return this.ground[x][y] != 0;
        });
    }

    reset() {
        this.emptyLines = 0;
        this.score = 0;
        this.level = 1;
        this.removedLines = 0;
        this.isGameover = false;
        this.isOperable = true;

        this.xOffset = parseInt(this.xblocks / 2) - 1;
        this.yOffset = 0;

        this.ground = Array(this.xblocks)
                        .fill()
                        .map(_ => Array(this.yblocks).fill(0));
    }

    moveTetrixLeft() {
        if (this.isMovable(-1, 0)) {
            this.xOffset--;
        }
    }

    moveTetrixRight() {
        if (this.isMovable(1, 0)) {
            this.xOffset++;
        }
    }

    moveTetrixDown() {
        if (this.isMovable(0, 1) && this.isOperable) {
            this.yOffset++;
        }
    }

    dropTetrix() {
        while (this.isMovable(0, 1) && this.isOperable) {
            this.yOffset++;
        }
    }

    rotateTetrix(isClockwise) {
        this.testPiece.blocks.forEach((block, i) => {
            block.x = this.tetrixPiece.blocks[i].x;
            block.y = this.tetrixPiece.blocks[i].y;
        });

        this.testPiece.rotate(isClockwise);

        let rotatable = this.testPiece.blocks.every(block => {
            let x = block.x + this.xOffset;
            let y = block.y + this.yOffset;
            return x >= 0 && x < this.xblocks && y < this.yblocks && y >= 0 && this.ground[x][y] == 0;
        });

        if (rotatable) {
            this.tetrixPiece.rotate(isClockwise);
        }
    }

    updateGround() {
        this.isOperable = false;

        if (!this.isGameover && !this.isMovable(0, 1)) {
            // touch the bottom of playground or the top of one piece 
            this.tetrixPiece.blocks.forEach(block => {
                let x = block.x + this.xOffset;
                let y = block.y + this.yOffset;
                this.ground[x][y] = this.tetrixPiece.type + 1;
            });

            let pieceTop = this.tetrixPiece.minimumY + this.yOffset;
            if (pieceTop < this.emptyLines) {
                this.emptyLines = pieceTop;
            }

            removeFullLines(this);
        }

        if((this.score / 50) > (this.level - 1)) {
            this.level++;
        }

        this.isOperable = true;
    }
}

function isFullLine(tground, j) {
    for (let i = 0; i < tground.xblocks; i++) {
        if (tground.ground[i][j] == 0) {
            return false;
        }
    }
    return true;
}

function cleanLine(tground, j) {
    // move lines down
    for (let k = j; k > tground.emptyLines; k--) {
        for (let i = 0; i < tground.xblocks; i++) {
            if (tground.ground[i][k] != tground.ground[i][k - 1]) {
                tground.ground[i][k] = tground.ground[i][k - 1];
            }
        }
    }

    // clean top line
    for (let i = 0; i < tground.xblocks; i++) {
        tground.ground[i][tground.emptyLines] = 0;
    }
}

function removeFullLines(tground) {
    let count = 0;
    for (let j = tground.yblocks - 1; j > tground.emptyLines; j--) {
        if (isFullLine(tground, j)) {
            cleanLine(tground, j);
            tground.emptyLines++;
            tground.removedLines++;
            count++;
            j++;
        }
    }

    tground.score = tground.score + parseInt(Math.pow(2, count));
}

export {TetrixPiece, TetrixGround};