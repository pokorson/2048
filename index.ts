import { renderGameBoard, moveTiles, addNewTile, boardHasPossibleMoves, initBoard } from './src/gameBoard';
import BoardState from './src/BoardState';
import BoardView from './src/BoardView';

const board2 = new BoardState();
board2.insertNewTileAtRandom();
board2.insertNewTileAtRandom();

let gameOver = false;

// renderGameBoard(board, 'game-board');
BoardView.renderBoard(board2, document.getElementById('game-board'));

document.addEventListener('keyup', (event) => {
    if (gameOver) return;
    const arrowKeyDirectionMap = {
        'ArrowDown': 'down',
        'ArrowUp': 'up',
        'ArrowLeft': 'left',
        'ArrowRight': 'right'
    };
    const direction = arrowKeyDirectionMap[event.key];
    if (!direction) return;

    board2.moveAllTiles(direction);
    BoardView.renderBoard(board2, document.getElementById('game-board'));

    board2.mergeTiles();
    BoardView.renderBoard(board2, document.getElementById('game-board'));

    board2.insertNewTileAtRandom();
    BoardView.renderBoard(board2, document.getElementById('game-board'));


})
