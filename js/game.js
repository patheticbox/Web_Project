function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// generate a new tetromino sequence
// @see https://tetris.fandom.com/wiki/Random_Generator
function generateSequence() {
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

    while (sequence.length) {
        const rand = getRandomInt(0, sequence.length - 1);
        const name = sequence.splice(rand, 1)[0];
        tetrominoSequence.push(name);
    }
}

// get the next tetromino in the sequence
function getNextTetromino() {
    if (tetrominoSequence.length === 0) {
        generateSequence();
    }

    const name = tetrominoSequence.pop();
    const matrix = tetrominos[name];

    // I and O start centered, all others start in left-middle
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

    // I starts on row 21 (-1), all others start on row 22 (-2)
    const row = name === 'I' ? -1 : -2;

    return {
        name: name,      // name of the piece (L, O, etc.)
        matrix: matrix,  // the current rotation matrix
        row: row,        // current row (starts offscreen)
        col: col         // current col
    };
}

// rotate an NxN matrix 90deg
// @see https://codereview.stackexchange.com/a/186834
function rotate(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[N - j][i])
    );

    return result;
}

// check to see if the new matrix/row/col is valid
function isValidMove(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] && (
                // outside the game bounds
                cellCol + col < 0 ||
                cellCol + col >= playfield[0].length ||
                cellRow + row >= playfield.length ||
                // collides with another piece
                playfield[cellRow + row][cellCol + col])
            ) {
                return false;
            }
        }
    }

    return true;
}

// place the tetromino on the playfield
function placeTetromino() {
    let rowsCleared = 0; // Variable to track the number of cleared rows

    for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
            if (tetromino.matrix[row][col]) {

                // game over if piece has any part offscreen
                if (tetromino.row + row < 0) {
                    return showGameOver();
                }

                playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
            }
        }
    }

    // Check for line clears
    for (let row = playfield.length - 1; row >= 0; ) {
        if (playfield[row].every(cell => !!cell)) {
            rowsCleared++; // Increment the cleared rows counter

            // Remove the cleared row
            playfield.splice(row, 1);
            playfield.unshift(Array(10).fill(0));
        } else {
            row--;
        }
    }

    // Calculate score from cleared rows
    const scoreFromRows = rowsCleared > 0 ? SCORE_PER_ROW * rowsCleared * MULTIPLIER_PER_ROW : 0;

    // Add score from piece placement and from cleared rows
    score += SCORE_PER_PIECE + scoreFromRows;

    // Get the next tetromino
    tetromino = getNextTetromino();
}

// Show the game over screen
function showGameOver() {
    cancelAnimationFrame(rAF);
    gameOver = true;

    context.fillStyle = 'black';
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);

    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '18px Arial'; // Розмір шрифту 18px
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Встановлення ширини рядка тексту на 300px
    const text = 'GAME OVER! Press any key to restart or Esc to return to main page';
    const maxWidth = 300;
    let words = text.split(' ');
    let line = '';
    let y = canvas.height / 2;
    let lineHeight = 24;

    for(let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = context.measureText(testLine);
        let testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, canvas.width / 2, y);
            line = words[n] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, canvas.width / 2, y);

    // Display score
    displayScore();

    // Update high scores
    updateHighScores();
    // Display high scores
    displayHighScores();
}
document.addEventListener('keydown', function(e) {
    if (gameOver && e.key === ' ') {
        restartGame();
    }
});

// Handle key press for game over screen
function handleKeyDown(e) {
    if (gameOver) {
        if (e.key === 'Escape') {
            window.location.href = 'index.html'; // Redirect to main page
        } else {
            restartGame();
        }
    }
}

// Restart the game
function restartGame() {
    document.removeEventListener('keydown', restartGame);
    playfield.forEach(row => row.fill(0)); // Clear the playfield
    tetrominoSequence.length = 0; // Clear the tetromino sequence
    generateSequence(); // Generate a new tetromino sequence
    tetromino = getNextTetromino(); // Get the first tetromino
    count = 0; // Reset the count
    rAF = requestAnimationFrame(loop); // Restart the game loop
    gameOver = false; // Reset game over flag
    score = 0; // Reset the score
}

// Display the score
function displayScore() {
    context.fillStyle = 'white';
    context.font = '18px Arial';
    context.textAlign = 'left';
    context.fillText('Score: ' + score, 20, 30);
}

// Display high scores
function updateHighScores() {
    if (score === 0) return; // Ignore zero scores

    highScores.push(score);

    // Keep only the top 10 scores
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, 10);
}

// Display high scores
function displayHighScores() {
    // Sort high scores in descending order
    highScores.sort((a, b) => b - a);

    context.fillStyle = 'white';
    context.font = '18px Arial';
    context.textAlign = 'left';

    context.fillText('Top 3 Scores:', 20, 60);
    for (let i = 0; i < Math.min(highScores.length, 3); i++) {
        context.fillText((i + 1) + '. ' + highScores[i], 20, 90 + i * 30);
    }

    // Sort high scores in ascending order
    highScores.sort((a, b) => a - b);

    context.fillText('Bottom 3 Scores:', 20, 210);
    for (let i = 0; i < Math.min(highScores.length, 3); i++) {
        context.fillText((i + 1) + '. ' + highScores[i], 20, 240 + i * 30);
    }
}

const SCORE_PER_PIECE = 10; // Score for placing a piece on the playfield
const SCORE_PER_ROW = 100; // Score for clearing a row
const MULTIPLIER_PER_ROW = 2; // Multiplier for score when clearing multiple rows simultaneously

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 32;
const tetrominoSequence = [];
let highScores = []; // Array to store high scores

// Keep track of what is in every cell of the game using a 2d array
// Tetris playfield is 10x20, with a few rows offscreen
const playfield = [];

// Populate the empty state
for (let row = -2; row < 20; row++) {
    playfield[row] = [];

    for (let col = 0; col < 10; col++) {
        playfield[row][col] = 0;
    }
}

// How to draw each tetromino
// @see https://tetris.fandom.com/wiki/SRS
const tetrominos = {
    'I': [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    'J': [
        [1,0,0],
        [1,1,1],
        [0,0,0],
    ],
    'L': [
        [0,0,1],
        [1,1,1],
        [0,0,0],
    ],
    'O': [
        [1,1],
        [1,1],
    ],
    'S': [
        [0,1,1],
        [1,1,0],
        [0,0,0],
    ],
    'Z': [
        [1,1,0],
        [0,1,1],
        [0,0,0],
    ],
    'T': [
        [0,1,0],
        [1,1,1],
        [0,0,0],
    ]
};

// Color of each tetromino
const colors = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
};

let count = 0;
let tetromino = getNextTetromino();
let rAF = null;  // Keep track of the animation frame so we can cancel it
let gameOver = false;
let score = 0;

// Game loop
function loop() {
    rAF = requestAnimationFrame(loop);
    context.clearRect(0,0,canvas.width,canvas.height);

    // Draw the playfield
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            if (playfield[row][col]) {
                const name = playfield[row][col];
                context.fillStyle = colors[name];

                // Drawing 1 px smaller than the grid creates a grid effect
                context.fillRect(col * grid, row * grid, grid-1, grid-1);
            }
        }
    }

    // Draw the active tetromino
    if (tetromino) {

        // Tetromino falls every 35 frames
        if (++count > 35) {
            tetromino.row++;
            count = 0;

            // Place piece if it runs into anything
            if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
                tetromino.row--;
                placeTetromino();
            }
        }

        context.fillStyle = colors[tetromino.name];

        for (let row = 0; row < tetromino.matrix.length; row++) {
            for (let col = 0; col < tetromino.matrix[row].length; col++) {
                if (tetromino.matrix[row][col]) {

                    // Drawing 1 px smaller than the grid creates a grid effect
                    context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid-1, grid-1);
                }
            }
        }
    }

    // Display score
    displayScore();
}

// Listen to keyboard events to move the active tetromino
document.addEventListener('keydown', function(e) {
    if (gameOver) return;

    // Left and right arrow keys (move)
    if (e.which === 37 || e.which === 39) {
        const col = e.which === 37
            ? tetromino.col - 1
            : tetromino.col + 1;

        if (isValidMove(tetromino.matrix, tetromino.row, col)) {
            tetromino.col = col;
        }
    }

    // Up arrow key (rotate)
    if (e.which === 38) {
        const matrix = rotate(tetromino.matrix);
        if (isValidMove(matrix, tetromino.row, tetromino.col)) {
            tetromino.matrix = matrix;
        }
    }

    
    if(e.which === 40) {
        const row = tetromino.row + 1;

        if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
            tetromino.row = row - 1;

            placeTetromino();
            return;
        }

        tetromino.row = row;
    }
});

// Start the game
rAF = requestAnimationFrame(loop);
