import { generateId } from './helpers';
import { createTile } from './gameBoard';

interface Tile {
    value: number;
    id: string;
}

type EmptyTile = {
    value: 0;
    id: string;
}

type TileRow = Array<Tile | EmptyTile | Tile[]>;

type BoardMoveDirection = 'left' | 'right' | 'up' | 'down';

interface BoardPosition {
    x: number;
    y: number;
}

class BoardState {
    state: TileRow[];

    constructor(initBoard?: number[][]) {
        let boardShape = initBoard;

        if (!boardShape) {
            boardShape = [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
        }

        this.state = boardShape.map(boardRow => {
            return boardRow.map(tileValue => this.getNewTile(tileValue))
        })
    }

    print = () => {
        this.state.forEach(
            (row, rowIndex) => {
                let rowString = ""
                row.forEach(
                    (tile, tileIndex) => {
                        if (!Array.isArray(tile))
                            rowString = rowString + " " + tile.value;
                    }
                )
                console.log(rowString + '\n');
                rowString = "";
            }
        )
    }

    getState = (): TileRow[] => {
        return this.state;
    }

    getNewTile = (value: number): Tile => ({ value, id: generateId() });
    getTileAt = (position: BoardPosition): Tile | Tile[] => {
        return this.state[position.y][position.x];
    }
    insertNewTileAtRandom = () => {
        let emptyTilesPositions: BoardPosition[] = [];
        this.state.forEach((row, rowIndex) => {
            row.forEach((tile, tileIndex) => {
                if (!Array.isArray(tile) && tile.value === 0) {
                    emptyTilesPositions.push({ x: tileIndex, y: rowIndex });
                }
            });
        });

        if (emptyTilesPositions.length > 0) {
            const randomEmptyPosition = emptyTilesPositions[Math.floor(Math.random() * emptyTilesPositions.length)];
            this.insertTileAt(this.getNewTile(2), randomEmptyPosition);
        }
    }
    insertTileAt = (tileToInsert: Tile, position: BoardPosition) => {
        this.state.forEach((row, rowIndex) => {
            row.forEach((tile, tileIndex) => {
                if (tileIndex === position.x && rowIndex === position.y) {
                    this.state[position.y][position.x] = tileToInsert;
                }
            })
        })
    }
    clearTileAt = (position: BoardPosition) => {
        this.insertTileAt(
            createTile(0),
            position
        )
    }
    moveTile = (startPosition, endPosition) => {
        const tileToMove = this.getTileAt(startPosition);

        if (Array.isArray(tileToMove)) return;

        this.insertTileAt(tileToMove, endPosition);
        this.clearTileAt(startPosition);
    }

    mergeTiles = () => {
        this.state.forEach(
            (row, rowIndex) => {
                row.forEach(
                    (tile, tileIndex) => {
                        if (Array.isArray(tile)) {
                            this.insertTileAt(
                                createTile(tile[0].value + tile[1].value),
                                { x: tileIndex, y: rowIndex }
                            );
                        }
                    }
                )
            }
        )
    }

    isPositionOccupied = (position: BoardPosition): boolean => {
        const tileAtPosition = this.getTileAt(position);
        if (!tileAtPosition) return true;
        if (Array.isArray(tileAtPosition)) return;

        return (tileAtPosition.value !== 0);
    }

    canMoveTileLeft = (startPosition: BoardPosition): boolean => {
        if (startPosition.x - 1 < 0) return false;

        if (this.isPositionOccupied({
            x: startPosition.x - 1,
            y: startPosition.y
        })) {
            return false;
        }
        return true;
    }

    moveTileLeft = (startPosition: BoardPosition) => {
        if (!this.canMoveTileLeft(startPosition)) return;
        this.moveTile(startPosition, { x: startPosition.x - 1, y: startPosition.y });
    }

    canMoveTileRight = (startPosition: BoardPosition): boolean => {
        if (startPosition.x >= this.state[startPosition.y].length) return false;

        if (this.isPositionOccupied({
            x: startPosition.x + 1,
            y: startPosition.y
        })) {
            return false;
        }
        return true;
    }

    moveTileRight = (startPosition: BoardPosition) => {
        if (!this.canMoveTileRight(startPosition)) return;
        this.moveTile(startPosition, { ...startPosition, x: startPosition.x + 1 });
    }

    canMoveTileUp = (startPosition: BoardPosition): boolean => {
        if (startPosition.y === 0) return false;

        if (this.isPositionOccupied({
            x: startPosition.x,
            y: startPosition.y - 1
        })) {
            return false;
        }
        return true;
    }

    moveTileUp = (startPosition: BoardPosition) => {
        if (!this.canMoveTileUp(startPosition)) return;
        this.moveTile(startPosition, { x: startPosition.x, y: startPosition.y - 1 });
    }

    canMoveTileDown = (startPosition: BoardPosition): boolean => {
        if (startPosition.y + 1 >= this.state[startPosition.y].length) return false;

        if (this.isPositionOccupied({
            x: startPosition.x,
            y: startPosition.y + 1
        })) {
            return false;
        }
        return true;
    }

    moveTileDown = (startPosition: BoardPosition) => {
        if (!this.canMoveTileDown(startPosition)) return;
        this.moveTile(startPosition, { x: startPosition.x, y: startPosition.y + 1 })
    }

    moveAllTiles = (direction: BoardMoveDirection) => {
        switch (direction) {
            case 'left':
                for (let rowIndex = 0; rowIndex < this.state.length; rowIndex++) {
                    for (let tileIndex = 0; tileIndex < this.state[rowIndex].length; tileIndex++) {
                        const tile = this.getTileAt({ x: tileIndex, y: rowIndex });
                        if ((!Array.isArray(tile)) && tile.value === 0) {
                            continue;
                        }
                        let position = { x: tileIndex, y: rowIndex };
                        while (this.canMoveTileLeft(position)) {
                            this.moveTileLeft(position);
                            position = { x: position.x - 1, y: rowIndex };
                        }
                    }
                }
                return;
            case 'up':
                for (let rowIndex = 0; rowIndex < this.state.length; rowIndex++) {
                    for (let tileIndex = 0; tileIndex < this.state[rowIndex].length; tileIndex++) {
                        const tile = this.getTileAt({ x: tileIndex, y: rowIndex });
                        if ((!Array.isArray(tile)) && tile.value === 0) {
                            continue;
                        }
                        let position = { x: tileIndex, y: rowIndex };
                        while (this.canMoveTileUp(position)) {
                            this.moveTileUp(position);
                            position = { x: tileIndex, y: position.y - 1 };
                        }
                    }
                }
                return;
            case 'right':
                for (let rowIndex = 0; rowIndex < this.state.length; rowIndex++) {
                    for (let tileIndex = this.state[rowIndex].length - 1; tileIndex >= 0; tileIndex--) {
                        const tile = this.getTileAt({ x: tileIndex, y: rowIndex });
                        if ((!Array.isArray(tile)) && tile.value === 0) {
                            continue;
                        }
                        let position = { x: tileIndex, y: rowIndex };
                        while (this.canMoveTileRight(position)) {
                            this.moveTileRight(position);
                            position = { x: position.x + 1, y: rowIndex };
                        }
                    }
                }
                return;
            case 'down':
                for (let rowIndex = this.state.length - 1; rowIndex >= 0; rowIndex--) {
                    for (let tileIndex = 0; tileIndex < this.state[rowIndex].length; tileIndex++) {
                        const tile = this.getTileAt({ x: tileIndex, y: rowIndex });
                        if ((!Array.isArray(tile)) && tile.value === 0) {
                            continue;
                        }
                        let position = { x: tileIndex, y: rowIndex };
                        while (this.canMoveTileDown(position)) {
                            this.moveTileDown(position);
                            position = { x: tileIndex, y: position.y + 1 };
                        }
                    }
                }
                return;
        }
    }
}

export default BoardState;