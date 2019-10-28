import { renderGameBoard, createBoard, moveTiles, addNewTile, boardHasPossibleMoves } from './src/gameBoard';

let board = createBoard([
    [4, 4, 8, 2],
    [4, 2, 4, 8],
    [2, 4, 8, 2],
    [4, 2, 4, 8],
]);

let gameOver = false;

renderGameBoard(board, 'game-board');

document.addEventListener('keyup', (event) => {
    if (gameOver) return;
    const arrowKeyDirectionMap = {
        'ArrowDown': 'down',
        'ArrowUp': 'up',
        'ArrowLeft': 'left',
        'ArrowRight': 'right'
    };
    if (!arrowKeyDirectionMap[event.key]) return;

    board = moveTiles(board, arrowKeyDirectionMap[event.key]);

    board = addNewTile(board);

    renderGameBoard(board, 'game-board');

    if (!boardHasPossibleMoves(board)) {
        gameOver = true;
        alert('game over!');
    }
})