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

export function createTile(value) {
    return { value };
}

export function createBoard(board?: number[][]): GameBoard {
    if (!board) {
        return {
            boardState: [
                [{value: 0}, {value: 0}, {value: 0}, {value: 0}],
                [{value: 0}, {value: 0}, {value: 0}, {value: 0}],
                [{value: 0}, {value: 0}, {value: 0}, {value: 0}],
                [{value: 0}, {value: 0}, {value: 0}, {value: 0}]
            ]
        }
    }

    return {
        boardState: 
            board.map(boardRow => {
                return boardRow.map(tileValue => createTile(tileValue))
            })
    };
}

function serializeBoard(board: GameBoard): number[][] {
    let serializedBoard = [[], [], [], []];
    board.boardState.forEach((row, rowIndex) => {
        row.forEach((tile, tileIndex) => {
            serializedBoard[rowIndex][tileIndex] = tile.value;
        })
    })
    return serializedBoard;
}

function isEmptyTile(tile) {
    return tile.value === 0;
}

function rowHasEmptyTile(boardRow: BoardRow): boolean {
    return boardRow.some(isEmptyTile);
}

function rowHasPossibleMerge(boardRow: BoardRow): boolean {
    let isMergePossible = false;
    boardRow.forEach((tile, index) => {
        const nextTile = boardRow[index + 1];
        if (nextTile && nextTile.value === tile.value) {
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

function getTransposedBoard(board: GameBoard): GameBoard {
    let newBoard = [[], [], [], []];
    board.boardState.forEach((row, rowIndex) => {
        row.forEach((tile, tileIndex) => {
            newBoard[board.boardState.length - tileIndex - 1][rowIndex] = tile.value;
        })
    });
    return createBoard(newBoard);
}

function canMoveColumns(board): boolean {
    const transposedBoard = getTransposedBoard(board);
    return canMoveRows(transposedBoard);
}

export function boardHasPossibleMoves(board: GameBoard): boolean {
    return canMoveRows(board) || canMoveColumns(board);
}

function findLastAvailablePosition(row: number[], tileIndex: number): number {
    for(let i = 0 ; i < tileIndex ; i++) {
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

function mergeValuesInRow(row: number[]): number[] {
    let resultRow = [...row];
    for(let i = 0; i < row.length ; i++) {
        const value = resultRow[i];
        const prevValue = resultRow[i - 1];

        if(prevValue !== undefined && value !==0 && prevValue === value) {
            resultRow[i - 1] = prevValue + value;
            resultRow[i] = 0;
            resultRow = shiftValuesToIndex(resultRow, i);
        }
    }
    
    return resultRow;
}

export function moveTiles(board: GameBoard): GameBoard {
    let mergedBoard = serializeBoard(board);

    mergedBoard.forEach((row, rowIndex) => {
        row.forEach((value, tileIndex) => {
            const prevTile = row[tileIndex - 1];
            if (prevTile !== undefined && prevTile === 0) {
                const lastAvailablePosition = findLastAvailablePosition(row, tileIndex);
                mergedBoard[rowIndex][lastAvailablePosition] = value;
                mergedBoard[rowIndex][tileIndex] = 0;
            }
             else {
                mergedBoard[rowIndex][tileIndex] = value;
            }
        })
    });

    mergedBoard = mergedBoard.map(mergeValuesInRow);
    
    return createBoard(mergedBoard);
}