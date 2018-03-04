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

function TetrixStackArea(tetrixBox, tetrixGround) {
    var backgroundColor = rgb(255, 255, 255);
    var width = tetrixGround.getGroundWidthInBlk() * tetrixBox.blockWidth;
    var height = tetrixGround.getGroundHeightInBlk() * tetrixBox.blockWidth;
                
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
        let bw = tetrixBox.blockWidth;
        context.drawImage(image, x * bw, y * bw, bw, bw);
        
        if(isBlockBorder) {
            context.beginPath();
            context.strokeStyle = 'rgb(150, 150, 150)';
            context.drawRect(x * bw, y * bw, bw, bw);
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