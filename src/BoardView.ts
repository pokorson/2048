import BoardState from './BoardState';
import '../styles/tiles.scss';

const TOP_OFFSET = 5;
const LEFT_OFFSET = 5;

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

function removeStaleElements(board: BoardState, targetEl) {
    let elementsIds = [];
    targetEl.childNodes.forEach(node => elementsIds.push(node.id))
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
            targetEl.removeChild(tileElement);

        }
    });
}

function renderTilesPlaceholders(board: BoardState) {
    const targetEl = document.getElementById('tile-placeholders');
    targetEl.innerHTML = "";

    board.getState().forEach(
        (row, rowIndex) => {
            row.forEach(
                (tile, tileIndex) => {
                    let placeholderElement = document.createElement('div');
                    placeholderElement.style.top = (TOP_OFFSET + rowIndex * 125).toString();
                    placeholderElement.style.left = (LEFT_OFFSET + tileIndex * 125).toString();
                    placeholderElement.classList.add('tile-placeholder');
                    targetEl.appendChild(placeholderElement);
                }
            )
        }
    );
}

const BoardView = {
    renderBoard: (board: BoardState, targetEl) => {
        renderTilesPlaceholders(board, targetEl);

        board.getState().forEach(
            (row, rowIndex) => {
                row.forEach(
                    (tile, tileIndex) => {
                        if (Array.isArray(tile)) {
                            insertOrUpdateTileElement(tile[0], { x: tileIndex, y: rowIndex }, targetEl);
                            insertOrUpdateTileElement(tile[1], { x: tileIndex, y: rowIndex }, targetEl);
                            return;
                        } else if (tile.value === 0) {
                            return;
                        } else {
                            insertOrUpdateTileElement(tile, { x: tileIndex, y: rowIndex }, targetEl);
                        }
                    }
                )
            }
        );
        setTimeout(() => removeStaleElements(board, targetEl), 200);

    }
}

export default BoardView;
