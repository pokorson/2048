export interface GameState<Board> {
    score: number;
    board: Board,
    gameOver: boolean,
}

export interface Tile {
    value: number;
    id: string;
}

export type EmptyTile = {
    value: 0;
    id: string;
}

export type TileRow = Array<Tile | EmptyTile | Tile[]>;

export type BoardMoveDirection = 'left' | 'right' | 'up' | 'down';

export interface BoardPosition {
    x: number;
    y: number;
}

export interface MoveVector {
    x: number;
    y: number;
}
