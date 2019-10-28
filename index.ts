import { renderGameBoard, createBoard, moveTiles, addNewTile } from './src/gameBoard';

let board = createBoard([
    [4, 4, 8, 2],
    [4, 2, 4, 8],
    [2, 4, 8, 2],
    [4, 2, 4, 8],
]);

renderGameBoard(board, 'game-board');

document.addEventListener('keyup', (event) => {
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
})