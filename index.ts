import { renderGameBoard, moveTiles, addNewTile, boardHasPossibleMoves, initBoard } from './src/gameBoard';
import BoardState from './src/BoardState';
import BoardView from './src/BoardView';

const board2 = new BoardState();
board2.insertNewTileAtRandom();
board2.insertNewTileAtRandom();

let board = initBoard();

let gameOver = false;

// renderGameBoard(board, 'game-board');
BoardView.renderBoard(board2, document.getElementById('game-board'));
board2.print();

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
    board2.moveAllTiles(arrowKeyDirectionMap[event.key]);
    board2.insertNewTileAtRandom();
    board2.print();

    BoardView.renderBoard(board2, document.getElementById('game-board'));

    board = addNewTile(board);

    // renderGameBoard(board, 'game-board');

    if (!boardHasPossibleMoves(board)) {
        gameOver = true;
        alert('game over!');
    }
})

document.getElementById('start-new-game').addEventListener('click', () => {
    board = initBoard();
    renderGameBoard(board, 'game-board');
});