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
        this.canvas = canvas;

        this.width = canvas.width;
        this.backgroundColor = rgb(255, 255, 255);
        this.border = false;
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

class TetrixStackArea {
    constructor(images, canvas) {
        this.images = images;
        this.canvas = canvas;

        this.width = canvas.width;
        this.height = canvas.height;       
        this.backgroundColor = rgb(255, 255, 255);
        this.border = false;
    }
    
    paint(tetrixGround) {
        let blockWidth = this.width / tetrixGround.xblocks;
        let context = canvas.getContext('2d');
        // clean previous screen
        context.fillStyle = this.backgroundColor;
        context.fillRect(0, 0, this.width, this.height);

        // draw current piece
        tetrixGround.tetrixPiece.blocks.forEach(block => {
             drawBlock(context, images[tetrixGround.tetrixPiece.type],
                    block.x + tetrixGround.xOffset,
                    block.y + tetrixGround.yOffset,
                    blockWidth, this.border);
        });

        // draw stack of pieces
        for(var i = 0; i < tetrixGround.xblocks; i++) {
            for(var j = 0; j < tetrixGround.yblocks; j++) {
                if(tetrixGround.ground[i][j] != 0) {
                    drawBlock(context, images[tetrixGround.ground[i][j] - 1], i, j,
                        blockWidth, this.border);
                }
            }
        }

        if(tetrixGround.isGameover) {
            context.save();
            context.shadowOffsetX = 1;
            context.shadowOffsetY = 1;
            context.shadowColor = 'black';
            context.font = blockWidth + 'px "Arial Black"';
            context.fillStyle = 'red';
            context.fillText('Game over', this.width / 5, this.height / 2);
            context.restore();
        }
    }
}