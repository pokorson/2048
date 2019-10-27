import {renderGameBoard, createBoard} from './src/gameBoard';

const board = createBoard([
    [4, 4, 8, 2],
    [4, 2, 4, 8],
    [2, 4, 8, 2],
    [4, 2, 4, 8],
]);
renderGameBoard(board, 'game-board');