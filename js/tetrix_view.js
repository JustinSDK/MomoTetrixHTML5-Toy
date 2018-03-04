function rgb(r, g, b) {
    return `rgb(${r}, ${g}, ${b})`;
}

function drawBlock(context, image, x, y, blockWidth, border) {
    context.drawImage(image, x * blockWidth, y * blockWidth, blockWidth, blockWidth);
    if(border) {
        context.beginPath();
        context.strokeStyle = rgb(150, 150, 150);
        context.rect(x * blockWidth, y * blockWidth, blockWidth, blockWidth);
        context.stroke();
    }
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
        let blockWidth = this.canvas.width / 4;
        let context = this.canvas.getContext('2d');
        context.fillStyle = this.backgroundColor;
        context.fillRect(0, 0, this.width, this.width);
        piece.blocks.forEach(b => {
            drawBlock(context, this.images[piece.type], b.x + 1, b.y + 1, blockWidth, this.border);
        });
    }
}

function TetrixStackArea(images, canvas) {
    this.backgroundColor = rgb(255, 255, 255);
    this.width = canvas.width;
    this.height = canvas.height;       
    this.isBlockBorder = false;
    this.context = canvas.getContext('2d');
    
    this.paint = function(tetrixGround) {
        let blockWidth = canvas.width / tetrixGround.xblocks;
        // clean previous screen
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.width, this.height);

        // draw current piece
        tetrixGround.tetrixPiece.blocks.forEach(block => {
             drawBlock(this.context, images[tetrixGround.tetrixPiece.type],
                    block.x + tetrixGround.xOffset,
                    block.y + tetrixGround.yOffset,
                    blockWidth, this.isBlockBorder);
        });

        // draw stack of pieces
        for(var i = 0; i < tetrixGround.xblocks; i++) {
            for(var j = 0; j < tetrixGround.yblocks; j++) {
                if(tetrixGround.ground[i][j] != 0) {
                    drawBlock(this.context, images[tetrixGround.ground[i][j] - 1], i, j,
                        blockWidth, this.isBlockBorder);
                }
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