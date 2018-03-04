function rgb(r, g, b) {
    return `rgb(${r}, ${g}, ${b})`;
}

const tetrixPieces = [
    TetrixPiece.FREEZE.Z, 
    TetrixPiece.FREEZE.S,  
    TetrixPiece.FREEZE.I,  
    TetrixPiece.FREEZE.J, 
    TetrixPiece.FREEZE.O, 
    TetrixPiece.FREEZE.T, 
    TetrixPiece.FREEZE.L 
];
   
class TetrixBox {
    constructor(images, canvas) {
        this.images = images;
        this.backgroundColor = rgb(255, 255, 255);
        this.border = false;
        this.canvas = canvas;
    }

    get width() {
        return this.canvas.width;
    }

    get height() {
        return this.canvas.height;
    }

    paint(piece) {
        // draw box background
        let context = this.canvas.getContext('2d');
        context.fillStyle = this.backgroundColor;
        context.fillRect(0, 0, this.width, this.height);
        piece.blocks.forEach(b => {
            this.drawBlock(context, piece, b.x + 1, b.y + 1);
        });
    }
    
    drawBlock(context, piece, x, y) {
        let bw = this.width / 4;
        let bh = this.height / 4;
        context.drawImage(this.images[piece.type], x * bw, y * bh, bw, bh);
        if(this.border) {
            context.beginPath();
            context.strokeStyle = rgb(150, 150, 150);
            context.rect(x * bw, y * bh, bw, bh);
            context.stroke();
        }
    }    
}

function TetrixGround(groundWidthInBlk, groundHeightInBlk) {
    var groundWidthInBlk = groundWidthInBlk || 10;
    var groundHeightInBlk = groundHeightInBlk || 20;
        
    var tetrixPiece;
    var testPiece;
    var ground = [];
    for(var i = 0; i < groundWidthInBlk; i++) {
        ground[i] = [];
        for(var j = 0; j < groundHeightInBlk; j++) {
            ground[i][j] = 0;
        }
    }
        
    var xOffset = parseInt(groundWidthInBlk / 2) - 1;
    var yOffset = 1;
    var emptyLines = groundHeightInBlk;
    
    var emptyLines = 0;
    var removedLines = 0;
    var score = 0;
    
    var isGameover = false;
    
    var isOperable = true;
    
    this.isMovable = function(xStep, yStep) {
        for(var i = 0; i < 4; i++) {
            var x = tetrixPiece.xOfBlock(i) + xOffset + xStep;
            var y = tetrixPiece.yOfBlock(i) + yOffset + yStep;

            if(x < 0 || x >= groundWidthInBlk || y >= groundHeightInBlk) {
                return false;
            }

            if(ground[x][y] != 0) {
                return false;
            }
        }

        return true;
    };
    
    this.addPieceOfType = function(pieceType) {
        tetrixPiece = new TetrixPiece(pieceType);
        testPiece = new TetrixPiece(pieceType);    
        
        xOffset = groundWidthInBlk / 2 - 1;
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
        emptyLines = groundHeightInBlk;
        score = 0;
        removedLines = 0;
        isGameover = false; 
        isOperable = true;
        
        xOffset = parseInt(groundWidthInBlk / 2) - 1;
        if(tetrixPiece.minimumY < 0) {
            yOffset = Math.abs(tetrixPiece.minimumY);
        }
        else {
            yOffset = 0;
        }
        
        for(var i = 0; i < groundWidthInBlk; i++) {
            for(var j = 0; j < groundHeightInBlk; j++) {
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

            if(x < 0 || x >= groundWidthInBlk || y >= groundHeightInBlk || y < 0) {
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
        for(var j = groundHeightInBlk - 1; j > emptyLines; j--) {
            var isFullLine = true;
            for(var i = 0; i < groundWidthInBlk; i++) {
                if(ground[i][j] == 0) {
                    isFullLine = false;
                    break;
                }
            }

            if(isFullLine) {
                count++;
                for(var k = j; k > emptyLines; k--) {
                    for(var i = 0; i < groundWidthInBlk; i++) {
                        if(ground[i][k] != ground[i][k-1]) {
                            ground[i][k] = ground[i][k-1];
                        }
                    }
                }
                
                for(var i = 0; i < groundWidthInBlk; i++) {
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
        return groundHeightInBlk;
    };
    
    this.getGroundWidthInBlk = function() {
        return groundWidthInBlk;
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

function TetrixStackArea(tetrixBox, tetrixGround) {
    var backgroundColor = rgb(255, 255, 255);
    var width = tetrixGround.getGroundWidthInBlk() * tetrixBox.width / 4;
    var height = tetrixGround.getGroundHeightInBlk() * tetrixBox.height / 4;
                
    var isBlockBorder = false;
    
    this.setBackgroundColor = function(color) {
        backgroundColor = color;
    };
    
    this.getBackgroundColor = function() {
        return backgroundColor;
    };
    
    this.setBlockBorder = function(flag) {
        isBlockBorder = flag;
    };
    
    this.isBlockBorder = function() {
        return isBlockBorder;
    };
    
    this.getWidth = function() {
        return width;
    };
    
    this.getHeight = function() {
        return height;
    };
        
    function drawBlock(context, image, x, y) {
        let bw = tetrixBox.width / 4;
        let bh = tetrixBox.height / 4;
        context.drawImage(image, x * bw, y * bh, bw, bh);
        
        if(isBlockBorder) {
            context.beginPath();
            context.strokeStyle = 'rgb(150, 150, 150)';
            context.drawRect(x * bw, y * bh, bw, bh);
            context.stroke();
        }
    }
    
    this.paint = function(context) {
        // clean previous screen
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, width, height);

        // draw current piece
        for(var i = 0; i < 4; i++) {
            drawBlock(context, tetrixBox.images[tetrixGround.getTetrixPiece().type],
                    tetrixGround.getTetrixPiece().xOfBlock(i) + tetrixGround.getXOffset(),
                    tetrixGround.getTetrixPiece().yOfBlock(i) + tetrixGround.getYOffset());
        }

        // draw stack of pieces
        for(var i = 0; i < tetrixGround.getGroundWidthInBlk(); i++) {
            for(var j = 0; j < tetrixGround.getGroundHeightInBlk(); j++) {
                if(tetrixGround.getGroundInfo()[i][j] == 0) {
                    continue;
                }
                drawBlock(context, tetrixBox.images[tetrixGround.getGroundInfo()[i][j] - 1], i, j);
            }
        }

        if(tetrixGround.isGameover()) {
            let bw = tetrixBox.width / 4;
            context.save();
            context.shadowOffsetX = 1;
            context.shadowOffsetY = 1;
            context.shadowColor = 'black';
            context.font = bw + 'px "Arial Black"';
            context.fillStyle = 'red';
            context.fillText('Game over', width / 5, height / 2);
            context.restore();
        }
    };
}