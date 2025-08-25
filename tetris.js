// Tetris Game Logic
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');

// Game constants
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 30;
const COLORS = [
    '#000000', // Empty
    '#FF0000', // I - Red
    '#00FF00', // O - Green  
    '#0000FF', // T - Blue
    '#FFFF00', // S - Yellow
    '#FF00FF', // Z - Magenta
    '#00FFFF', // J - Cyan
    '#FFA500'  // L - Orange
];

// Tetromino shapes
const PIECES = [
    // I piece
    [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    // O piece
    [
        [2,2],
        [2,2]
    ],
    // T piece
    [
        [0,3,0],
        [3,3,3],
        [0,0,0]
    ],
    // S piece
    [
        [0,4,4],
        [4,4,0],
        [0,0,0]
    ],
    // Z piece
    [
        [5,5,0],
        [0,5,5],
        [0,0,0]
    ],
    // J piece
    [
        [6,0,0],
        [6,6,6],
        [0,0,0]
    ],
    // L piece
    [
        [0,0,7],
        [7,7,7],
        [0,0,0]
    ]
];

// Game state
let board = [];
let currentPiece = null;
let currentX = 0;
let currentY = 0;
let nextPiece = null;
let score = 0;
let level = 1;
let lines = 0;
let dropTime = 0;
let lastTime = 0;
let gameRunning = false;
let paused = false;

// Initialize the game board
function initBoard() {
    board = [];
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        board[y] = [];
        for (let x = 0; x < BOARD_WIDTH; x++) {
            board[y][x] = 0;
        }
    }
}

// Create a random piece
function createPiece() {
    const pieceIndex = Math.floor(Math.random() * PIECES.length);
    return {
        shape: PIECES[pieceIndex],
        color: pieceIndex + 1
    };
}

// Rotate a piece 90 degrees clockwise
function rotatePiece(piece) {
    const rotated = [];
    const size = piece.length;
    
    for (let y = 0; y < size; y++) {
        rotated[y] = [];
        for (let x = 0; x < size; x++) {
            rotated[y][x] = piece[size - 1 - x][y];
        }
    }
    return rotated;
}

// Check if a piece can be placed at the given position
function isValidPosition(piece, x, y) {
    for (let py = 0; py < piece.length; py++) {
        for (let px = 0; px < piece[py].length; px++) {
            if (piece[py][px] !== 0) {
                const newX = x + px;
                const newY = y + py;
                
                if (newX < 0 || newX >= BOARD_WIDTH || 
                    newY >= BOARD_HEIGHT || 
                    (newY >= 0 && board[newY][newX] !== 0)) {
                    return false;
                }
            }
        }
    }
    return true;
}

// Place a piece on the board
function placePiece() {
    for (let py = 0; py < currentPiece.shape.length; py++) {
        for (let px = 0; px < currentPiece.shape[py].length; px++) {
            if (currentPiece.shape[py][px] !== 0) {
                const boardY = currentY + py;
                const boardX = currentX + px;
                if (boardY >= 0) {
                    board[boardY][boardX] = currentPiece.color;
                }
            }
        }
    }
}

// Clear completed lines
function clearLines() {
    let linesCleared = 0;
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        let lineComplete = true;
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (board[y][x] === 0) {
                lineComplete = false;
                break;
            }
        }
        
        if (lineComplete) {
            board.splice(y, 1);
            board.unshift(new Array(BOARD_WIDTH).fill(0));
            linesCleared++;
            y++; // Check the same line again
        }
    }
    
    if (linesCleared > 0) {
        lines += linesCleared;
        score += linesCleared * 100 * level;
        level = Math.floor(lines / 10) + 1;
        updateDisplay();
    }
}

// Spawn a new piece
function spawnPiece() {
    if (!nextPiece) {
        nextPiece = createPiece();
    }
    
    currentPiece = nextPiece;
    nextPiece = createPiece();
    
    currentX = Math.floor(BOARD_WIDTH / 2) - Math.floor(currentPiece.shape[0].length / 2);
    currentY = 0;
    
    if (!isValidPosition(currentPiece.shape, currentX, currentY)) {
        gameOver();
    }
    
    drawNextPiece();
}

// Move piece down
function dropPiece() {
    if (isValidPosition(currentPiece.shape, currentX, currentY + 1)) {
        currentY++;
    } else {
        placePiece();
        clearLines();
        spawnPiece();
    }
}

// Move piece left or right
function movePiece(direction) {
    const newX = currentX + direction;
    if (isValidPosition(currentPiece.shape, newX, currentY)) {
        currentX = newX;
    }
}

// Rotate current piece
function rotatePieceClockwise() {
    const rotated = rotatePiece(currentPiece.shape);
    if (isValidPosition(rotated, currentX, currentY)) {
        currentPiece.shape = rotated;
    }
}

// Hard drop piece
function hardDrop() {
    while (isValidPosition(currentPiece.shape, currentX, currentY + 1)) {
        currentY++;
        score += 2;
    }
    placePiece();
    clearLines();
    spawnPiece();
    updateDisplay();
}

// Draw a single cell
function drawCell(x, y, color) {
    ctx.fillStyle = COLORS[color];
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    
    if (color !== 0) {
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1;
        ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
}

// Draw the game board
function drawBoard() {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            drawCell(x, y, board[y][x]);
        }
    }
}

// Draw the current piece
function drawCurrentPiece() {
    if (currentPiece) {
        for (let py = 0; py < currentPiece.shape.length; py++) {
            for (let px = 0; px < currentPiece.shape[py].length; px++) {
                if (currentPiece.shape[py][px] !== 0) {
                    drawCell(currentX + px, currentY + py, currentPiece.color);
                }
            }
        }
    }
}

// Draw the next piece
function drawNextPiece() {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    if (nextPiece) {
        const offsetX = (nextCanvas.width / CELL_SIZE - nextPiece.shape[0].length) / 2;
        const offsetY = (nextCanvas.height / CELL_SIZE - nextPiece.shape.length) / 2;
        
        for (let py = 0; py < nextPiece.shape.length; py++) {
            for (let px = 0; px < nextPiece.shape[py].length; px++) {
                if (nextPiece.shape[py][px] !== 0) {
                    nextCtx.fillStyle = COLORS[nextPiece.color];
                    nextCtx.fillRect(
                        (offsetX + px) * CELL_SIZE, 
                        (offsetY + py) * CELL_SIZE, 
                        CELL_SIZE, 
                        CELL_SIZE
                    );
                    nextCtx.strokeStyle = '#222';
                    nextCtx.lineWidth = 1;
                    nextCtx.strokeRect(
                        (offsetX + px) * CELL_SIZE, 
                        (offsetY + py) * CELL_SIZE, 
                        CELL_SIZE, 
                        CELL_SIZE
                    );
                }
            }
        }
    }
}

// Update display elements
function updateDisplay() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('lines').textContent = lines;
}

// Game over
function gameOver() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').style.display = 'block';
}

// Start new game
function startGame() {
    initBoard();
    score = 0;
    level = 1;
    lines = 0;
    dropTime = 0;
    gameRunning = true;
    paused = false;
    nextPiece = null;
    
    document.getElementById('gameOver').style.display = 'none';
    updateDisplay();
    spawnPiece();
    gameLoop();
}

// Main game loop
function gameLoop(currentTime = 0) {
    if (!gameRunning) return;
    
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    if (!paused) {
        dropTime += deltaTime;
        const dropInterval = Math.max(50, 500 - (level - 1) * 50);
        
        if (dropTime >= dropInterval) {
            dropPiece();
            dropTime = 0;
        }
    }
    
    // Clear canvas and redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawCurrentPiece();
    
    requestAnimationFrame(gameLoop);
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    if (!gameRunning || paused) return;
    
    switch (event.key) {
        case 'ArrowLeft':
            movePiece(-1);
            break;
        case 'ArrowRight':
            movePiece(1);
            break;
        case 'ArrowDown':
            dropPiece();
            break;
        case 'ArrowUp':
            rotatePieceClockwise();
            break;
        case ' ':
            event.preventDefault();
            hardDrop();
            break;
    }
});

// Handle pause
document.addEventListener('keydown', (event) => {
    if (event.key === ' ' && gameRunning) {
        event.preventDefault();
        paused = !paused;
    }
});

// Initialize game when page loads
window.addEventListener('load', () => {
    startGame();
});