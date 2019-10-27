import { renderGameBoard, createBoard, moveTiles } from './src/gameBoard';

let board = createBoard([
    [4, 4, 8, 2],
    [4, 2, 4, 8],
    [2, 4, 8, 2],
    [4, 2, 4, 8],
]);
renderGameBoard(board, 'game-board');

document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowDown':
            board = moveTiles(board, 'down');
            renderGameBoard(board, 'game-board');
            return;
        case 'ArrowUp':
            board = moveTiles(board, 'up');
            renderGameBoard(board, 'game-board');
            return;
        case 'ArrowLeft':
            board = moveTiles(board, 'left');
            renderGameBoard(board, 'game-board');
            return;
        case 'ArrowRight':
            board = moveTiles(board, 'right');
            renderGameBoard(board, 'game-board');
            return;
    }
})