function rgb(r, g, b) {
    return `rgb(${r}, ${g}, ${b})`;
}
 
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

    get blockWidth() {
        return this.canvas.width / 4;
    }

    paint(piece) {
        let context = this.canvas.getContext('2d');
        context.fillStyle = this.backgroundColor;
        context.fillRect(0, 0, this.width, this.width);
        piece.blocks.forEach(b => {
            this.drawBlock(context, piece, b.x + 1, b.y + 1);
        });
    }
    
    drawBlock(context, piece, x, y) {
        let bw = this.blockWidth;
        context.drawImage(this.images[piece.type], x * bw, y * bw, bw, bw);
        if(this.border) {
            context.beginPath();
            context.strokeStyle = rgb(150, 150, 150);
            context.rect(x * bw, y * bw, bw, bw);
            context.stroke();
        }
    }    
}

function TetrixStackArea(images, blockWidth, tetrixGround) {
    var backgroundColor = rgb(255, 255, 255);
    var width = tetrixGround.xblocks * blockWidth;
    var height = tetrixGround.yblocks * blockWidth;
                
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
        context.drawImage(image, x * blockWidth, y * blockWidth, blockWidth, blockWidth);
        
        if(isBlockBorder) {
            context.beginPath();
            context.strokeStyle = 'rgb(150, 150, 150)';
            context.drawRect(x * blockWidth, y * blockWidth, blockWidth, blockWidth);
            context.stroke();
        }
    }
    
    this.paint = function(context) {
        // clean previous screen
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, width, height);

        // draw current piece
        for(var i = 0; i < 4; i++) {
            drawBlock(context, images[tetrixGround.tetrixPiece.type],
                    tetrixGround.tetrixPiece.xOfBlock(i) + tetrixGround.xOffset,
                    tetrixGround.tetrixPiece.yOfBlock(i) + tetrixGround.yOffset);
        }

        // draw stack of pieces
        for(var i = 0; i < tetrixGround.xblocks; i++) {
            for(var j = 0; j < tetrixGround.yblocks; j++) {
                if(tetrixGround.ground[i][j] == 0) {
                    continue;
                }
                drawBlock(context, images[tetrixGround.ground[i][j] - 1], i, j);
            }
        }

        if(tetrixGround.isGameover) {
            context.save();
            context.shadowOffsetX = 1;
            context.shadowOffsetY = 1;
            context.shadowColor = 'black';
            context.font = blockWidth + 'px "Arial Black"';
            context.fillStyle = 'red';
            context.fillText('Game over', width / 5, height / 2);
            context.restore();
        }
    };
}