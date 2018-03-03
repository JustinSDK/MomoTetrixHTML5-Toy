function TetrixBox(boxWidthInBlk, boxHeightInBlk, 
                   blockWidth,  blockHeight) {
    boxWidthInBlk = boxWidthInBlk || 4;
    boxHeightInBlk = boxHeightInBlk || 4;
    blockWidth = blockWidth || 25;
    blockHeight = blockHeight || 25;
    
    var isBlockBorder = false;
    var tetrixPieces = [];
    for(var i = 0; i < 7; i++) {
        tetrixPieces[i] = new TetrixPiece(i);
    }
    
    // default background: rgb(255, 255, 255)
    var backgroundColor = rgb(255, 255, 255);
    var width = boxWidthInBlk * blockWidth;
    var height = boxHeightInBlk * blockHeight;
    
    var tetrixImages = null;
    var currentPiece = currentImage = null;

    this.setTetrixImages = function(images) {
        tetrixImages = images;
    };
    
    this.getTetrixImages = function() {
        return tetrixImages;
    };
    
    this.next = function() {
        var index = parseInt(Math.random() * 7);
        currentPiece = tetrixPieces[index];
        currentImage = tetrixImages[index];
    };
    
    this.getTetrixPiece = function() {
        return currentPiece;
    };
    
    this.getTetrixImage = function() {
        return currentImage;
    };

    this.setBackgroundColor = function(color) {
        backgroundColor = color;
    }
    
    this.getBackgroundColor = function() {
        return backgroundColor;
    };
    
    this.setBlockBorder = function(flag) {
        isBlockBorder = flag;
    };
    
    this.isBlockBorder = function() {
        return isBlockBorder;
    };
    
    this.getBlockWidth = function() {
        return blockWidth;
    };
    
    this.getBlockHeight = function() {
        return blockHeight;
    };
    
    this.getWidth = function() {
        return width;
    };
    
    this.getHeight = function() {
        return height;
    };
    
    function drawBlock(context, x, y) {
        context.drawImage(currentImage, x * blockWidth, y * blockHeight, blockWidth, blockHeight);
        if(isBlockBorder) {
            context.beginPath();
            context.strokeStyle = rgb(150, 150, 150);
            context.rect(x * blockWidth, y * blockHeight, blockWidth, blockHeight);
            context.stroke();
        }
    }

    this.paint = function(context) {
        // draw box background
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, width, height);
        for(var i = 0; i < 4; i++) {
            drawBlock(context, currentPiece.getBlockXCoord(i) + 1, currentPiece.getBlockYCoord(i) + 1);
        }
    }
}