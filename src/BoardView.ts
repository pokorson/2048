import BoardState from './BoardState';

function insertOrUpdateTileElement(tile, position, targetEl) {
    const TOP_OFFSET = 5;
    const LEFT_OFFSET = 5;
    const existingTileElement = document.getElementById(tile.id);

    if (existingTileElement) {
        existingTileElement.style.transform = `translate(${(LEFT_OFFSET + position.x * 125)}px, ${TOP_OFFSET + position.y * 125}px)`;
        return existingTileElement;
    } else {
        const tileElement = document.createElement('div');

        tileElement.id = tile.id;
        tileElement.innerText = tile.value.toString();
        tileElement.classList.add('tile');
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

const BoardView = {
    renderBoard: (board: BoardState, targetEl) => {
        board.getState().forEach(
            (row, rowIndex) => {
                row.forEach(
                    (tile, tileIndex) => {
                        if (Array.isArray(tile)) {
                            insertOrUpdateTileElement(tile[0], { x: tileIndex, y: rowIndex }, targetEl);
                            insertOrUpdateTileElement(tile[1], { x: tileIndex, y: rowIndex }, targetEl);
                            return;
                        }
                        if (tile.value === 0) return;

                        insertOrUpdateTileElement(tile, { x: tileIndex, y: rowIndex }, targetEl);
                    }
                )
            }
        );
        setTimeout(() => {
            removeStaleElements(board, targetEl);
        }, 200);

    }
}

export default BoardView;
