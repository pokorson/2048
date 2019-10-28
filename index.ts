import BoardState from './src/BoardState';
import BoardView from './src/BoardView';

let currentScore = 0;

function handleScoreUpdate(score) {
    const scoreElement = document.getElementById('current-score');
    currentScore = currentScore + score;
    scoreElement.innerText = `Score: ${currentScore}`
}

let board = new BoardState({
    onScore: handleScoreUpdate
});
board.insertNewTileAtRandom();
board.insertNewTileAtRandom();

let gameOver = false;

BoardView.renderBoard(board, document.getElementById('tile-container'));

document.addEventListener('keyup', (event) => {
    const boardElement = document.getElementById('tile-container');
    if (gameOver) return;
    const arrowKeyDirectionMap = {
        'ArrowDown': 'down',
        'ArrowUp': 'up',
        'ArrowLeft': 'left',
        'ArrowRight': 'right'
    };
    const direction = arrowKeyDirectionMap[event.key];
    if (!direction) return;

    console.log("MOVING: " + direction);

    console.log('Initial state:');
    board.print();

    board.shiftAllTiles(direction);
    BoardView.renderBoard(board, boardElement);

    board.mergeTiles();
    BoardView.renderBoard(board, boardElement);

    board.insertNewTileAtRandom();
    BoardView.renderBoard(board, boardElement);

    console.log('Final state:');
    board.print();
})

document.getElementById('start-new-game').addEventListener('click', () => {
    const boardElement = document.getElementById('tile-container');
    gameOver = false;
    board = new BoardState({ onScore: handleScoreUpdate });
    board.insertNewTileAtRandom();
    board.insertNewTileAtRandom();
    boardElement.innerHTML = "";
    currentScore = 0;
    const scoreElement = document.getElementById('current-score');
    scoreElement.innerText = `Score: ${currentScore}`
    BoardView.renderBoard(board, boardElement);
})
