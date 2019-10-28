import { generateId } from './helpers';

interface Tile {
    value: number;
}

type EmptyTile = {
    value: 0
}

type BoardRow = Array<Tile | EmptyTile>;

interface GameBoard {
    boardState: BoardRow[];
}

export function createTile(value: number) {
    return { value, id: generateId() };
}

function getTileValue(tile: Tile): number {
    return tile.value;
}

const defaultBoardState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
]

export function createBoard(board: number[][] = defaultBoardState): GameBoard {
    return {
        boardState:
            board.map(boardRow => {
                return boardRow.map(tileValue => createTile(tileValue))
            })
    };
}

export function initBoard(): GameBoard {
    let board = createBoard();
    board = addNewTile(board);
    board = addNewTile(board);
    return board;
}

export function getTileAt(board: GameBoard, x: number, y: number): Tile {
    return board.boardState[y][x];
}

export function areBoardsEqual(board1: GameBoard, board2: GameBoard): boolean {
    let equal = true;
    board1.boardState.forEach((row, rowIndex) => {
        row.forEach((tile, tileIndex) => {
            const board1Tile = getTileAt(board1, tileIndex, rowIndex);
            const board2Tile = getTileAt(board2, tileIndex, rowIndex);

            if (getTileValue(board1Tile) !== getTileValue(board2Tile)) {
                equal = false;
            }
        })
    })
    return equal;
}

export function serializeBoard(board: GameBoard): number[][] {
    let serializedBoard = [[], [], [], []];
    board.boardState.forEach((row, rowIndex) => {
        row.forEach((tile, tileIndex) => {
            serializedBoard[rowIndex][tileIndex] = getTileValue(tile);
        })
    })
    return serializedBoard;
}

function isEmptyTile(tile) {
    return getTileValue(tile) === 0;
}

function rowHasEmptyTile(boardRow: BoardRow): boolean {
    return boardRow.some(isEmptyTile);
}

function rowHasPossibleMerge(boardRow: BoardRow): boolean {
    let isMergePossible = false;
    boardRow.forEach((tile, index) => {
        const nextTile = boardRow[index + 1];
        if (nextTile && getTileValue(nextTile) === getTileValue(tile)) {
            isMergePossible = true;
        }
    })
    return isMergePossible;
}

function canMoveRows(board: GameBoard): boolean {
    return board.boardState.some(
        (boardRow) =>
            rowHasEmptyTile(boardRow) ||
            rowHasPossibleMerge(boardRow)
    );
}

export function getRotatedBoard(board: GameBoard, transpositions: number = 1): GameBoard {
    if (transpositions === 0) return board;

    let newBoard = serializeBoard(board);

    board.boardState.forEach((row, rowIndex) => {
        row.forEach((tile, tileIndex) => {
            newBoard[board.boardState.length - tileIndex - 1][rowIndex] = getTileValue(tile);
        })
    });

    return getRotatedBoard(createBoard(newBoard), transpositions - 1);
}

function canMoveColumns(board): boolean {
    const transposedBoard = getRotatedBoard(board);
    return canMoveRows(transposedBoard);
}

export function boardHasPossibleMoves(board: GameBoard): boolean {
    return canMoveRows(board) || canMoveColumns(board);
}

function findLastAvailablePosition(row: number[], tileIndex: number): number {
    for (let i = 0; i < tileIndex; i++) {
        if (row[i] === 0) {
            return i;
        }
    }

    return tileIndex;
}


function shiftValuesToIndex(row: number[], index: number): number[] {
    let resultRow = [...row];
    return [...resultRow.slice(0, index), ...resultRow.slice(index + 1), 0];
}

type MergeDirection = 'left' | 'right';

function mergeValuesInRow(row: number[], direction: MergeDirection = 'left'): number[] {
    let resultRow = direction === 'left' ? [...row] : row.reverse();
    for (let i = 0; i < row.length; i++) {
        const value = resultRow[i];
        const prevValue = resultRow[i - 1];

        if (prevValue !== undefined && value !== 0 && prevValue === value) {
            resultRow[i - 1] = prevValue + value;
            resultRow[i] = 0;
            resultRow = shiftValuesToIndex(resultRow, i);
        }
    }

    return direction === 'left' ? resultRow : resultRow.reverse();
}

function shiftValuesInRow(row: number[], direction: MergeDirection): number[] {
    if (direction === 'left') {
        let resultRow = [...row];
        for (let i = 0; i < row.length; i++) {
            const prevValue = resultRow[i - 1];
            if (prevValue !== undefined && prevValue === 0) {
                const lastAvailablePosition = findLastAvailablePosition(resultRow, i);
                resultRow[lastAvailablePosition] = resultRow[i];
                resultRow[i] = 0;
            }
        }
        return resultRow;
    } else {
        let resultRow = row.reverse();
        for (let i = 0; i < row.length; i++) {
            const prevValue = resultRow[i - 1];
            if (prevValue !== undefined && prevValue === 0) {
                const lastAvailablePosition = findLastAvailablePosition(resultRow, i);
                resultRow[lastAvailablePosition] = resultRow[i];
                resultRow[i] = 0;
            }
        }
        return resultRow.reverse();
    }
}

type MoveDirection = 'left' | 'right' | 'up' | 'down';

export function moveTiles(board: GameBoard, direction: MoveDirection): GameBoard {
    const transpotionsCount = {
        'left': 0,
        'down': 1,
        'right': 0,
        'up': 1
    }
    const reverseTransposition = {
        'left': 0,
        'down': 3,
        'right': 0,
        'up': 3
    }
    const mergeDirection: Record<MoveDirection, MergeDirection> = {
        'left': 'left',
        'down': 'right',
        'right': 'right',
        'up': 'left'
    }
    let rotatedBoard = serializeBoard(
        getRotatedBoard(board, transpotionsCount[direction])
    );

    // console.log(rotatedBoard, serializeBoard(board));

    const movedBoard = rotatedBoard.map((row) => {
        return shiftValuesInRow(row, mergeDirection[direction]);
    });

    // console.log('MOVED BOARD:\n')

    // console.log(movedBoard, serializeBoard(board));

    const mergedBoard = movedBoard.map((row) => mergeValuesInRow(row, mergeDirection[direction]));

    // console.log(serializeBoard(getRotatedBoard(createBoard(mergedBoard), reverseTransposition[direction])), serializeBoard(board));

    return getRotatedBoard(createBoard(mergedBoard), reverseTransposition[direction]);
}

export function addNewTile(board: GameBoard) {
    const boardState = serializeBoard(board);
    let emptyTilesPositions = [];
    boardState.forEach((row, rowIndex) => {
        row.forEach((tile, tileIndex) => {
            if (tile === 0) {
                emptyTilesPositions.push({ x: tileIndex, y: rowIndex });
            }
        });
    });

    if (emptyTilesPositions.length > 0) {
        let { x, y } = emptyTilesPositions[Math.floor(Math.random() * emptyTilesPositions.length)];
        boardState[y][x] = 2;
    }

    return createBoard(boardState);
}

function createTileElement(tile: Tile, { position }) {
    if (isEmptyTile(tile)) return;

    const TOP_OFFSET = 5;
    const LEFT_OFFSET = 5;
    const tileElement = document.createElement('div');

    tileElement.innerText = getTileValue(tile).toString();
    tileElement.classList.add('tile');
    tileElement.style.transform = `translate(${(LEFT_OFFSET + position.x * 125)}px, ${TOP_OFFSET + position.y * 125}px)`;
    return tileElement;
}

export function renderGameBoard(board: GameBoard, elementSelector: string) {
    const element = document.getElementById(elementSelector);
    const result = document.createElement('div');
    element.innerHTML = "";

    board.boardState.forEach((row, rowIndex) => {
        row.forEach((tile, tileIndex) => {
            if (!isEmptyTile(tile)) {
                const tileElement = createTileElement(tile, { position: { x: tileIndex, y: rowIndex } });
                result.appendChild(tileElement);
            }
        })
    })

    element.appendChild(result);
}