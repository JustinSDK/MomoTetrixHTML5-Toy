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

    paint(piece) {
        let context = this.canvas.getContext('2d');
        context.fillStyle = this.backgroundColor;
        context.fillRect(0, 0, this.width, this.width);
        piece.blocks.forEach(b => {
            this.drawBlock(context, piece, b.x + 1, b.y + 1);
        });
    }
    
    drawBlock(context, piece, x, y) {
        let bw = this.canvas.width / 4;
        context.drawImage(this.images[piece.type], x * bw, y * bw, bw, bw);
        if(this.border) {
            context.beginPath();
            context.strokeStyle = rgb(150, 150, 150);
            context.rect(x * bw, y * bw, bw, bw);
            context.stroke();
        }
    }    
}

function TetrixStackArea(images, canvas) {
    this.backgroundColor = rgb(255, 255, 255);
    this.width = canvas.width;
    this.height = canvas.height;       
    this.isBlockBorder = false;
    this.context = canvas.getContext('2d');
        
    function drawBlock(context, image, x, y, blockWidth) {
        context.drawImage(image, x * blockWidth, y * blockWidth, blockWidth, blockWidth);
        
        if(this.isBlockBorder) {
            context.beginPath();
            context.strokeStyle = 'rgb(150, 150, 150)';
            context.drawRect(x * blockWidth, y * blockWidth, blockWidth, blockWidth);
            context.stroke();
        }
    }
    
    this.paint = function(tetrixGround) {
        let blockWidth = canvas.width / tetrixGround.xblocks;
        // clean previous screen
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.width, this.height);

        // draw current piece
        for(var i = 0; i < 4; i++) {
            drawBlock(this.context, images[tetrixGround.tetrixPiece.type],
                    tetrixGround.tetrixPiece.xOfBlock(i) + tetrixGround.xOffset,
                    tetrixGround.tetrixPiece.yOfBlock(i) + tetrixGround.yOffset,
                    blockWidth);
        }

        // draw stack of pieces
        for(var i = 0; i < tetrixGround.xblocks; i++) {
            for(var j = 0; j < tetrixGround.yblocks; j++) {
                if(tetrixGround.ground[i][j] == 0) {
                    continue;
                }
                drawBlock(this.context, images[tetrixGround.ground[i][j] - 1], i, j,
                    blockWidth);
            }
        }

        if(tetrixGround.isGameover) {
            this.context.save();
            this.context.shadowOffsetX = 1;
            this.context.shadowOffsetY = 1;
            this.context.shadowColor = 'black';
            this.context.font = blockWidth + 'px "Arial Black"';
            this.context.fillStyle = 'red';
            this.context.fillText('Game over', this.width / 5, this.height / 2);
            this.context.restore();
        }
    };
}