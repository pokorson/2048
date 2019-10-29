import BoardState from './src/BoardState';
import GameView from './src/GameViewManager';
import { GameState } from './src/types';

function handleScoreUpdate(score) {
    gameState.score = gameState.score + score;
    GameView.renderScoreElement(gameState.score);
}

function handleNewGameClick() {
    GameView.clearTiles();

    startGame();
}

function handleKeyboardAction(event) {
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
    GameView.renderGame(gameState.board); // render before all updates for smoother slide animation

    board.sumUpMergedTiles();

    board.insertNewTileAtRandom();
    GameView.renderGame(gameState.board);

    if (!board.hasAnyPossibleMoves()) {
        gameState.gameOver = true;
        alert('Game over!');
    }
}

const gameState: GameState<BoardState> = {
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

function startGame() {
    initGame();
    GameView.renderGame(gameState.board);
    GameView.renderScoreElement(gameState.score);
}

document.addEventListener('keyup', handleKeyboardAction);

document.getElementById('start-new-game').addEventListener('click', handleNewGameClick);

startGame();
