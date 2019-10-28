import { expect } from 'chai';
import { createBoard, boardHasPossibleMoves, serializeBoard, moveTiles, getRotatedBoard, areBoardsEqual } from '../src/gameBoard';

describe('gameBoard', function () {
    describe('#boardHasPossibleMoves', function () {
        it('returns false when board has no possible moves', function () {
            const board = createBoard([
                [2, 4, 8, 2],
                [4, 2, 4, 8],
                [2, 4, 8, 2],
                [4, 2, 4, 8],
            ]);
            expect(boardHasPossibleMoves(board)).to.be.false;
        })

        it('returns true when board has at least one possible left/right move', function () {
            const board1 = createBoard([
                [4, 4, 8, 2],
                [4, 2, 4, 8],
                [2, 4, 8, 2],
                [4, 2, 4, 8],
            ]);
            expect(boardHasPossibleMoves(board1)).to.equal(true);
        })

        it('returns true when board has at least one possible up/down move', function () {
            const board = createBoard([
                [2, 4, 8, 4],
                [4, 2, 4, 8],
                [2, 4, 2, 8],
                [4, 2, 4, 8],
            ]);
            expect(boardHasPossibleMoves(board)).to.be.true;
        })
    })

    describe('#moveTiles', function () {
        const boardValues = [
            [0, 0, 0, 0],
            [0, 2, 4, 0],
            [0, 4, 2, 0],
            [0, 0, 0, 0],
        ];
        it('moves all tiles from right to left', function () {
            const initialBoard = createBoard(boardValues);
            const expectedResult = createBoard([
                [0, 0, 0, 0],
                [2, 4, 0, 0],
                [4, 2, 0, 0],
                [0, 0, 0, 0],
            ]);
            expect(areBoardsEqual(
                moveTiles(initialBoard, 'left'),
                expectedResult
            )).to.be.true;
        })

        it('moves all tiles from left to right', function () {
            const initialBoard = createBoard(boardValues);
            const expectedResult = createBoard([
                [0, 0, 0, 0],
                [0, 0, 2, 4],
                [0, 0, 4, 2],
                [0, 0, 0, 0],
            ]);
            expect(areBoardsEqual(
                moveTiles(initialBoard, 'right'),
                expectedResult
            )).to.be.true;
        })

        it('moves all tiles from top to bottom', function () {
            const initialBoard = createBoard(boardValues);
            const expectedResult = createBoard([
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 2, 4, 0],
                [0, 4, 2, 0],
            ]);
            expect(areBoardsEqual(
                moveTiles(initialBoard, 'down'),
                expectedResult
            )).to.be.true;
        });

        it('moves all tiles from bottom to top', function () {
            const initialBoard = createBoard(boardValues);
            const expectedResult = createBoard([
                [0, 2, 4, 0],
                [0, 4, 2, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ]);
            expect(areBoardsEqual(
                moveTiles(initialBoard, 'up'),
                expectedResult
            )).to.be.true;
        });

        it('moves all tiles to the last empty tile in row from right to left', function () {
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
            expect(areBoardsEqual(
                moveTiles(board, 'left'),
                expectedResult
            )).to.be.true;
        })

        it('merges adjacent tiles when they have the same value', function () {
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
            expect(areBoardsEqual(
                moveTiles(board, 'left'),
                expectedResult
            )).to.be.true;
        })

        it('merges adjacent tiles when they have the same value and place them at last available position', function () {
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
            expect(areBoardsEqual(
                moveTiles(board, 'left'),
                expectedResult
            )).to.be.true;

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
            expect(areBoardsEqual(
                moveTiles(board2, 'left'),
                expectedResult2
            )).to.be.true;
        })

        it('merges tiles with gap between them when they have the same value and place them at last available position', function () {
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
            expect(areBoardsEqual(
                moveTiles(board, 'left'),
                expectedResult
            )).to.be.true;
        })

        it('merges right tile to left one and place them at last available position', function () {
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
            expect(areBoardsEqual(
                moveTiles(board, 'left'),
                expectedResult
            )).to.be.true;
        })

        it('merges all tile pairs with the same value and place them at last available position', function () {
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
            expect(areBoardsEqual(
                moveTiles(board, 'left'),
                expectedResult
            )).to.be.true;
        })
    });
})