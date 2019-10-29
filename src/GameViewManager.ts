import BoardState from './BoardState';
import '../styles/tiles.scss';

const TOP_OFFSET = 5;
const LEFT_OFFSET = 5;

const tilesContainer = document.getElementById('tile-container');
const tilePlaceholderContainer = document.getElementById('tile-placeholders');
const scoreContainer = document.getElementById('current-score');


function renderScoreElement(score) {
    scoreContainer.innerText = `Score: ${score}`;
}

function insertOrUpdateTileElement(tile, position, targetEl) {
    const existingTileElement = document.getElementById(tile.id);

    if (existingTileElement) {
        existingTileElement.style.transform = `translate(${(LEFT_OFFSET + position.x * 125)}px, ${TOP_OFFSET + position.y * 125}px)`;
        return existingTileElement;
    } else {
        const tileElement = document.createElement('div');
        const tileValue = tile.value;

        tileElement.id = tile.id;
        tileElement.innerText = tileValue.toString();
        tileElement.classList.add('tile');
        if (tileValue > 2048) {
            tileElement.classList.add('tile-super');
        } else {
            tileElement.classList.add(`tile-${tileValue}`);
        }
        tileElement.style.transform = `translate(${(LEFT_OFFSET + position.x * 125)}px, ${TOP_OFFSET + position.y * 125}px)`;
        targetEl.appendChild(tileElement);
    }
}

function removeStaleElements(board: BoardState) {
    let elementsIds = [];
    tilesContainer.childNodes.forEach(node => elementsIds.push(node.id))
    let tilesIds = [];
    board.getState().forEach(row => {
        row.forEach(tile => {
            if (!Array.isArray(tile) && tile.value !== 0) {

                tilesIds.push(tile.id);
            }
        })
    });
    elementsIds.forEach(id => {
        if (!tilesIds.includes(id)) {

            let tileElement = document.getElementById(id);
            tilesContainer.removeChild(tileElement);

        }
    });
}

function renderTilesPlaceholders(board: BoardState) {
    tilePlaceholderContainer.innerHTML = "";

    board.getState().forEach(
        (row, rowIndex) => {
            row.forEach(
                (tile, tileIndex) => {
                    let placeholderElement = document.createElement('div');
                    placeholderElement.style.top = (TOP_OFFSET + rowIndex * 125).toString();
                    placeholderElement.style.left = (LEFT_OFFSET + tileIndex * 125).toString();
                    placeholderElement.classList.add('tile-placeholder');
                    tilePlaceholderContainer.appendChild(placeholderElement);
                }
            )
        }
    );
}

function renderGame(board) {
    renderTilesPlaceholders(board);

    board.getState().forEach(
        (row, rowIndex) => {
            row.forEach(
                (tile, tileIndex) => {
                    if (Array.isArray(tile)) {
                        insertOrUpdateTileElement(tile[0], { x: tileIndex, y: rowIndex }, tilesContainer);
                        insertOrUpdateTileElement(tile[1], { x: tileIndex, y: rowIndex }, tilesContainer);
                        return;
                    } else if (tile.value === 0) {
                        return;
                    } else {
                        insertOrUpdateTileElement(tile, { x: tileIndex, y: rowIndex }, tilesContainer);
                    }
                }
            )
        }
    );
    setTimeout(() => removeStaleElements(board), 200); // delay removing merged elements for smoother slide animation
}


function clearTiles() {
    tilesContainer.innerHTML = "";
}

const GameViewManager = {
    clearTiles,
    renderGame,
    renderScoreElement
}

export default GameViewManager;
