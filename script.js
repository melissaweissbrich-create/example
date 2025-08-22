class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.finalScoreElement = document.getElementById('finalScore');
        this.gameOverElement = document.getElementById('gameOver');
        
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        this.reset();
        this.loadHighScore();
        this.setupEventListeners();
    }
    
    reset() {
        this.snake = [
            {x: 10, y: 10}
        ];
        this.food = this.generateFood();
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameStarted = false;
        
        this.updateScore();
        this.gameOverElement.classList.add('hidden');
    }
    
    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.isSnakePosition(food.x, food.y));
        return food;
    }
    
    isSnakePosition(x, y) {
        return this.snake.some(segment => segment.x === x && segment.y === y);
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.reset();
            this.startGame();
        });
    }
    
    handleKeyPress(e) {
        if (!this.gameRunning || this.gamePaused) return;
        
        const key = e.key;
        
        if (key === 'ArrowLeft' && this.dx !== 1) {
            this.dx = -1;
            this.dy = 0;
            this.gameStarted = true;
        } else if (key === 'ArrowUp' && this.dy !== 1) {
            this.dx = 0;
            this.dy = -1;
            this.gameStarted = true;
        } else if (key === 'ArrowRight' && this.dx !== -1) {
            this.dx = 1;
            this.dy = 0;
            this.gameStarted = true;
        } else if (key === 'ArrowDown' && this.dy !== -1) {
            this.dx = 0;
            this.dy = 1;
            this.gameStarted = true;
        }
    }
    
    startGame() {
        if (this.gameRunning) return;
        
        this.gameRunning = true;
        this.gamePaused = false;
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        
        this.gameLoop();
    }
    
    togglePause() {
        if (!this.gameRunning) return;
        
        this.gamePaused = !this.gamePaused;
        document.getElementById('pauseBtn').textContent = this.gamePaused ? 'Weiter' : 'Pause';
        
        if (!this.gamePaused) {
            this.gameLoop();
        }
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        setTimeout(() => {
            this.update();
            this.draw();
            
            if (this.gameRunning) {
                this.gameLoop();
            }
        }, 150);
    }
    
    update() {
        if (!this.gameRunning || this.gamePaused || !this.gameStarted) return;
        
        // Move snake head
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        if (this.isSnakePosition(head.x, head.y)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.food = this.generateFood();
        } else {
            this.snake.pop();
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake
        this.ctx.fillStyle = '#4CAF50';
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Snake head
                this.ctx.fillStyle = '#81C784';
            } else {
                this.ctx.fillStyle = '#4CAF50';
            }
            this.ctx.fillRect(
                segment.x * this.gridSize, 
                segment.y * this.gridSize, 
                this.gridSize - 2, 
                this.gridSize - 2
            );
        });
        
        // Draw food
        this.ctx.fillStyle = '#f44336';
        this.ctx.fillRect(
            this.food.x * this.gridSize, 
            this.food.y * this.gridSize, 
            this.gridSize - 2, 
            this.gridSize - 2
        );
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
        
        if (this.score > this.getHighScore()) {
            this.saveHighScore(this.score);
            this.highScoreElement.textContent = this.score;
        }
    }
    
    gameOver() {
        this.gameRunning = false;
        this.gamePaused = false;
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = 'Pause';
        
        this.finalScoreElement.textContent = this.score;
        this.gameOverElement.classList.remove('hidden');
        
        if (this.score > this.getHighScore()) {
            this.saveHighScore(this.score);
        }
    }
    
    loadHighScore() {
        const highScore = this.getHighScore();
        this.highScoreElement.textContent = highScore;
    }
    
    getHighScore() {
        return parseInt(localStorage.getItem('snakeHighScore') || '0');
    }
    
    saveHighScore(score) {
        localStorage.setItem('snakeHighScore', score.toString());
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new SnakeGame();
    game.draw(); // Draw initial state
});