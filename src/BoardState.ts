import { generateId } from './helpers';

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

interface MoveVector {
    x: number;
    y: number;
}

interface BoardStateConstructorArgs {
    initialValues?: number[][];
    onScore?: (score: number) => void;
}

class BoardState {
    state: TileRow[];
    onScore = (score) => { };

    constructor({ initialValues, onScore }: BoardStateConstructorArgs) {
        let boardShape = initialValues;
        this.onScore = onScore;

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

    print = () => {
        this.state.forEach(
            (row, rowIndex) => {
                let rowString = ""
                row.forEach(
                    (tile, tileIndex) => {
                        if (Array.isArray(tile)) {
                            rowString = rowString + " " + `[${tile[0].value}, ${tile[1].value}]`;
                        } else {
                            rowString = rowString + " " + tile.value;
                        }
                    }
                )
                console.log(rowString + '\n');
                rowString = "";
            }
        )
    }

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
            this.getNewTile(0),
            position
        )
    }

    mergeTiles = () => {
        this.state.forEach(
            (row, rowIndex) => {
                row.forEach(
                    (tile, tileIndex) => {
                        if (Array.isArray(tile)) {
                            const newValue = tile[0].value + tile[1].value;
                            this.insertTileAt(
                                this.getNewTile(newValue),
                                { x: tileIndex, y: rowIndex }
                            );

                            this.onScore(newValue);
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
        if (Array.isArray(tile1) || Array.isArray(tile2)) return false;

        if (tile1.value === 0 || tile2.value === 0) return false;
        return (tile1.value === tile2.value);
    }

    mergeAdjacentTiles = (targetTilePosition: BoardPosition, tileToMergePosition: BoardPosition) => {
        const tileToMerge = this.getTileAt(tileToMergePosition);
        const targetTile = this.getTileAt(targetTilePosition);

        if (Array.isArray(targetTile) || Array.isArray(tileToMerge)) return;
        this.state[targetTilePosition.y][targetTilePosition.x] = [targetTile, tileToMerge];
        this.clearTileAt(tileToMergePosition);
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


    moveTile = (startPosition, endPosition) => {
        const tileToMove = this.getTileAt(startPosition);

        if (Array.isArray(tileToMove)) return;

        this.insertTileAt(tileToMove, endPosition);
        this.clearTileAt(startPosition);
    }

    getTranslatedPosition = (position: BoardPosition, translationVector: MoveVector): MoveVector => ({
        x: position.x + translationVector.x,
        y: position.y + translationVector.y
    })

    moveOrMergeTile = (startPosition: BoardPosition, vector: MoveVector) => {
        if (!this.canMoveTile(startPosition, vector)) return;

        const newPosition = this.getTranslatedPosition(startPosition, vector);
        const tileToMove = this.getTileAt(startPosition);
        const targetTile = this.getTileAt(newPosition);

        if (this.canMergeTiles(tileToMove, targetTile)) {
            this.mergeAdjacentTiles(newPosition, startPosition);
        } else {
            this.moveTile(startPosition, newPosition);
        }
    }

    moveSingleTile = (position: BoardPosition, moveVector: MoveVector) => {
        const tile = this.getTileAt(position);

        if ((!Array.isArray(tile)) && tile.value === 0) return;

        if (!this.canMoveTile(position, moveVector)) return;

        this.moveOrMergeTile(position, moveVector);

        const nextPosition = this.getTranslatedPosition(position, moveVector)
        this.moveSingleTile(
            nextPosition,
            moveVector
        );
    }

    moveAllTiles = (direction: BoardMoveDirection) => {
        switch (direction) {
            case 'left':
                for (let rowIndex = 0; rowIndex < this.state.length; rowIndex++) {
                    for (let tileIndex = 0; tileIndex < this.state[rowIndex].length; tileIndex++) {
                        const position = { x: tileIndex, y: rowIndex };
                        const moveVector = { x: -1, y: 0 };

                        this.moveSingleTile(position, moveVector);
                    }
                }
                return;
            case 'up':
                for (let rowIndex = 0; rowIndex < this.state.length; rowIndex++) {
                    for (let tileIndex = 0; tileIndex < this.state[rowIndex].length; tileIndex++) {
                        const moveVector = { x: 0, y: -1 };
                        const position = { x: tileIndex, y: rowIndex };

                        this.moveSingleTile(position, moveVector);
                    }
                }
                return;
            case 'right':
                for (let rowIndex = 0; rowIndex < this.state.length; rowIndex++) {
                    for (let tileIndex = this.state[rowIndex].length - 1; tileIndex >= 0; tileIndex--) {
                        const moveVector = { x: 1, y: 0 };
                        const position = { x: tileIndex, y: rowIndex };

                        this.moveSingleTile(position, moveVector);
                    }
                }
                return;
            case 'down':
                for (let rowIndex = this.state.length - 1; rowIndex >= 0; rowIndex--) {
                    for (let tileIndex = 0; tileIndex < this.state[rowIndex].length; tileIndex++) {
                        const moveVector = { x: 0, y: 1 };
                        const position = { x: tileIndex, y: rowIndex };

                        this.moveSingleTile(position, moveVector);
                    }
                }
                return;
        }
    }
}

export default BoardState;