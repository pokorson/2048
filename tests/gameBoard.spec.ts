import {expect} from 'chai';
import {createBoard, boardHasPossibleMoves, moveTiles, getRotatedBoard} from '../src/gameBoard';

describe('gameBoard', function() {
    describe('#getRotatedBoard', () => {
        it('rotates board 1 time correctly', function() {
            const board = createBoard([
                [2, 4, 8, 2],
                [4, 2, 4, 8],
                [2, 4, 8, 2],
                [4, 2, 4, 8],
            ]);
            expect(getRotatedBoard(board)).to.deep.equal(
                createBoard([
                    [2, 8, 2, 8],
                    [8, 4, 8, 4],
                    [4, 2, 4, 2],
                    [2, 4, 2, 4],
                ])
            );
        })

        it('rotates board 2 times correctly', function() {
            const board = createBoard([
                [2, 4, 8, 2],
                [4, 2, 4, 8],
                [2, 4, 8, 2],
                [4, 2, 4, 8],
            ]);
            expect(getRotatedBoard(board, 2)).to.deep.equal(
                createBoard([
                    [8, 4, 2, 4],
                    [2, 8, 4, 2],
                    [8, 4, 2, 4],
                    [2, 8, 4, 2],
                ])
            );
        })

        it('rotates board 3 times correctly', function() {
            const board = createBoard([
                [2, 4, 8, 2],
                [4, 2, 4, 8],
                [2, 4, 8, 2],
                [4, 2, 4, 8],
            ]);
            expect(getRotatedBoard(board, 3)).to.deep.equal(
                createBoard([
                    [4, 2, 4, 2],
                    [2, 4, 2, 4],
                    [4, 8, 4, 8],
                    [8, 2, 8, 2],
                ])
            );
        })

        it('rotates board 4 times correctly', function() {
            const board = createBoard([
                [2, 4, 8, 2],
                [4, 2, 4, 8],
                [2, 4, 8, 2],
                [4, 2, 4, 8],
            ]);
            expect(getRotatedBoard(board, 4)).to.deep.equal(
                createBoard([
                    [2, 4, 8, 2],
                    [4, 2, 4, 8],
                    [2, 4, 8, 2],
                    [4, 2, 4, 8],
                ])
            );
        })
    })

    describe('#boardHasPossibleMoves', function() {
        it('returns false when board has no possible moves', function() {
            const board = createBoard([
                [2, 4, 8, 2],
                [4, 2, 4, 8],
                [2, 4, 8, 2],
                [4, 2, 4, 8],
            ]);
            expect(boardHasPossibleMoves(board)).to.be.false;
        })

        it('returns true when board has at least one possible left/right move', function() {
            const board1 = createBoard([
                [4, 4, 8, 2],
                [4, 2, 4, 8],
                [2, 4, 8, 2],
                [4, 2, 4, 8],
            ]);
            expect(boardHasPossibleMoves(board1)).to.equal(true);

            const board2 = createBoard([
                [0, 0, 0, 0],
                [0, 2, 2, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ]);
            expect(boardHasPossibleMoves(board2)).to.be.true;
        })

        it('returns true when board has at least one possible up/down move', function() {
            const board = createBoard([
                [2, 4, 8, 4],
                [4, 2, 4, 8],
                [2, 4, 2, 8],
                [4, 2, 4, 8],
            ]);
            expect(boardHasPossibleMoves(board)).to.be.true;

            const board2 = createBoard([
                [2, 4, 8, 4],
                [4, 2, 4, 8],
                [4, 4, 2, 4],
                [4, 2, 4, 8],
            ]);
            expect(boardHasPossibleMoves(board2)).to.be.true;
        })
    })

    describe('#moveTiles', function() {
        const boardValues = [
            [0, 0, 0, 0],
            [0, 2, 4, 0],
            [0, 4, 2, 0],
            [0, 0, 0, 0],
        ];
        it('moves all tiles from right to left', function() {
            const initialBoard = createBoard(boardValues);
            const expectedResult = createBoard([
                [0, 0, 0, 0],
                [2, 4, 0, 0],
                [4, 2, 0, 0],
                [0, 0, 0, 0],
            ]);
            expect(moveTiles(initialBoard, 'left')).to.deep.equal(expectedResult);
        })

        it('moves all tiles from left to right', function() {
            const initialBoard = createBoard(boardValues);
            const expectedResult = createBoard([
                [0, 0, 0, 0],
                [0, 0, 2, 4],
                [0, 0, 4, 2],
                [0, 0, 0, 0],
            ]);
            expect(moveTiles(initialBoard, 'right')).to.deep.equal(expectedResult);
        })

        it('moves all tiles from top to bottom', function() {
            const initialBoard = createBoard(boardValues);
            const expectedResult = createBoard([
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 2, 4, 0],
                [0, 4, 2, 0],
            ]);
            expect(moveTiles(initialBoard, 'down')).to.deep.equal(expectedResult);
        });

        it('moves all tiles from bottom to top', function() {
            const initialBoard = createBoard(boardValues);
            const expectedResult = createBoard([
                [0, 2, 4, 0],
                [0, 4, 2, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ]);
            expect(moveTiles(initialBoard, 'up')).to.deep.equal(expectedResult);
        });

        it('moves all tiles to the last empty tile in row from right to left', function() {
            const board = createBoard([
                [0, 0, 4, 2],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            const expectedResult = createBoard([
                [4, 2, 0, 0],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            expect(moveTiles(board, 'left')).to.deep.equal(expectedResult);
        })

        it('merges adjacent tiles when they have the same value', function() {
            const board = createBoard([
                [2, 2, 0, 0],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            const expectedResult = createBoard([
                [4, 0, 0, 0],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            expect(moveTiles(board, 'left')).to.deep.equal(expectedResult);
        })

        it('merges adjacent tiles when they have the same value and place them at last available position', function() {
            const board = createBoard([
                [0, 2, 2, 0],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            const expectedResult = createBoard([
                [4, 0, 0, 0],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            expect(moveTiles(board, 'left')).to.deep.equal(expectedResult);

            const board2 = createBoard([
                [2, 2, 2, 0],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            const expectedResult2 = createBoard([
                [4, 2, 0, 0],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            expect(moveTiles(board2, 'left')).to.deep.equal(expectedResult2);
        })

        it('merges tiles with gap between them when they have the same value and place them at last available position', function() {
            const board = createBoard([
                [0, 2, 0, 2],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            const expectedResult = createBoard([
                [4, 0, 0, 0],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            expect(moveTiles(board, 'left')).to.deep.equal(expectedResult);
        })

        it('merges right tile to left one and place them at last available position', function() {
            const board = createBoard([
                [0, 2, 2, 2],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            const expectedResult = createBoard([
                [4, 2, 0, 0],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            expect(moveTiles(board, 'left')).to.deep.equal(expectedResult);
        })

        it('merges all tile pairs with the same value and place them at last available position', function() {
            const board = createBoard([
                [2, 2, 2, 2],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            const expectedResult = createBoard([
                [4, 4, 0, 0],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            expect(moveTiles(board, 'left')).to.deep.equal(expectedResult);
        })
    });
})