import BoardState from './src/BoardState';
import BoardView from './src/BoardView';


function handleScoreUpdate(score) {
    const scoreElement = document.getElementById('current-score');
    gameState.score = gameState.score + score;
    scoreElement.innerText = `Score: ${gameState.score}`
}

const gameState: {
    board: BoardState,
    score: number,
    gameOver: boolean
} = {
    score: 0,
    board: null,
    gameOver: false,
}

function initGame() {
    gameState.score = 0;
    gameState.gameOver = false;

    gameState.board = new BoardState({
        onScore: handleScoreUpdate
    })

    gameState.board.insertNewTileAtRandom();
    gameState.board.insertNewTileAtRandom();
}

function clearBoardElement() {
    const gameContainer = document.getElementById('tile-container');
    gameContainer.innerHTML = "";
}

function renderBoard() {
    const gameContainer = document.getElementById('tile-container');

    BoardView.renderBoard(
        gameState.board,
        gameContainer
    );
}

function renderScoreElement() {
    const scoreElement = document.getElementById('current-score');
    scoreElement.innerText = `Score: ${gameState.score}`;
}

function startGame() {
    initGame();
    renderBoard();
    renderScoreElement();
}

document.addEventListener('keyup', (event) => {
    if (gameState.gameOver) return;
    const arrowKeyDirectionMap = {
        'ArrowDown': 'down',
        'ArrowUp': 'up',
        'ArrowLeft': 'left',
        'ArrowRight': 'right'
    };
    const direction = arrowKeyDirectionMap[event.key];
    if (!direction) return;

    const board = gameState.board;

    board.shiftAllTiles(direction);
    renderBoard(); // render before all updates for smoother slide animation

    board.sumUpMergedTiles();

    board.insertNewTileAtRandom();
    renderBoard();
})

document.getElementById('start-new-game').addEventListener('click', () => {
    clearBoardElement();

    startGame();
})

startGame();