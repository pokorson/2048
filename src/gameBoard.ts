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