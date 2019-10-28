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

    serialize = () => (
        this.state.map(row => (
            row.map(tile => {
                if (Array.isArray(tile)) {
                    return [tile[0].value, tile[1].value];
                }
                return tile.value;
            })
        ))
    )

    hasPossibleMoves = (): boolean => {
        let anyPossibleMove = false;
        this.state.forEach((row, rowIndex) => {
            row.forEach((tile, tileIndex) => {
                const position = { x: tileIndex, y: rowIndex };
                if (
                    this.canMoveTile(position, { x: 1, y: 0 }) ||
                    this.canMoveTile(position, { x: -1, y: 0 }) ||
                    this.canMoveTile(position, { x: 0, y: 1 }) ||
                    this.canMoveTile(position, { x: 0, y: -1 })
                ) {
                    anyPossibleMove = true
                }

            })
        })
        return anyPossibleMove;
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

    canMergeTiles = (tile1: Tile | Tile[], tile2: Tile | Tile[]): boolean => {
        console.log('canMergeTiles inside', tile1, tile2)
        if (Array.isArray(tile1) || Array.isArray(tile2)) return false;

        if (tile1.value === 0 || tile2.value === 0) return false;
        console.log(tile2.value, tile1.value)
        return (tile1.value === tile2.value);
    }

    mergeAdjacentTiles = (targetTilePosition: BoardPosition, tileToMergePosition: BoardPosition) => {
        const tileToMerge = this.getTileAt(tileToMergePosition);
        const targetTile = this.getTileAt(targetTilePosition);

        if (Array.isArray(targetTile) || Array.isArray(tileToMerge)) return;

        this.insertTileAt(
            this.getNewTile(tileToMerge.value + targetTile.value),
            targetTilePosition
        );
        this.clearTileAt(tileToMergePosition);
        console.log(this.mergeAdjacentTiles);
    }

    canMoveTile = (startPosition, moveVector: { x: number, y: number }): boolean => {
        const newPosition = { x: startPosition.x + moveVector.x, y: startPosition.y + moveVector.y };
        const isPositionInRange = (
            newPosition.y < this.state.length &&
            newPosition.y >= 0 &&
            newPosition.x < this.state[newPosition.y].length &&
            newPosition.x >= 0
        );

        if (!isPositionInRange) return false;

        const tileToMove = this.getTileAt(startPosition);
        const targetTile = this.getTileAt(newPosition);

        if (Array.isArray(targetTile) || Array.isArray(tileToMove)) return false;

        if (targetTile.value !== 0 && targetTile.value !== tileToMove.value) return false;

        return true;

    }

    moveTileLeft = (startPosition: BoardPosition) => {
        if (!this.canMoveTile(startPosition, { x: -1, y: 0 })) return;
        const newPosition = { x: startPosition.x - 1, y: startPosition.y };
        const tileToMove = this.getTileAt(startPosition);
        const targetTile = this.getTileAt(newPosition);
        if (this.canMergeTiles(tileToMove, targetTile)) {
            console.log('canMergeTiles')
            this.mergeAdjacentTiles(startPosition, newPosition);
        } else {
            this.moveTile(startPosition, { x: startPosition.x - 1, y: startPosition.y });
        }
    }

    moveTileRight = (startPosition: BoardPosition) => {
        if (!this.canMoveTile(startPosition, { x: 1, y: 0 })) return;
        this.moveTile(startPosition, { ...startPosition, x: startPosition.x + 1 });
    }

    moveTileUp = (startPosition: BoardPosition) => {
        if (!this.canMoveTile(startPosition, { x: 0, y: -1 })) return;
        this.moveTile(startPosition, { x: startPosition.x, y: startPosition.y - 1 });
    }

    moveTileDown = (startPosition: BoardPosition) => {
        if (!this.canMoveTile(startPosition, { x: 0, y: 1 })) return;
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
                        while (this.canMoveTile(position, { x: -1, y: 0 })) {
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
                        while (this.canMoveTile(position, { x: 0, y: -1 })) {
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
                        while (this.canMoveTile(position, { x: 1, y: 0 })) {
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
                        while (this.canMoveTile(position, { x: 0, y: 1 })) {
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