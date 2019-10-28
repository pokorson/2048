import BoardState from '../src/BoardState';
import { expect } from 'chai';

describe.only('BoardState', () => {
    describe('#hasPossibleMoves', function () {
        it('returns false when board has no possible moves', function () {
            const board = new BoardState([
                [2, 4, 8, 2],
                [4, 2, 4, 8],
                [2, 4, 8, 2],
                [4, 2, 4, 8],
            ]);
            expect(board.hasPossibleMoves()).to.be.false;
        })

        it('returns true when board has at least one possible left/right move', function () {
            const board = new BoardState([
                [4, 4, 8, 2],
                [4, 2, 4, 8],
                [2, 4, 8, 2],
                [4, 2, 4, 8],
            ]);
            expect(board.hasPossibleMoves()).to.be.true;
        })

        it('returns true when board has at least one possible up/down move', function () {
            const board = new BoardState([
                [2, 4, 8, 4],
                [4, 2, 4, 8],
                [2, 4, 2, 8],
                [4, 2, 4, 8],
            ]);
            expect(board.hasPossibleMoves()).to.be.true;
        })
    })

    describe.only('#moveTiles', function () {
        const boardValues = [
            [0, 0, 0, 0],
            [0, 2, 4, 0],
            [0, 4, 2, 0],
            [0, 0, 0, 0],
        ];
        it('moves all tiles from right to left', function () {
            const board = new BoardState(boardValues);
            const expectedBoardState = ([
                [0, 0, 0, 0],
                [2, 4, 0, 0],
                [4, 2, 0, 0],
                [0, 0, 0, 0],
            ]);
            board.moveAllTiles('left');
            expect(
                board.serialize()
            ).to.deep.equal(expectedBoardState);
        })

        it('moves all tiles from left to right', function () {
            const board = new BoardState(boardValues);
            const expectedBoardState = ([
                [0, 0, 0, 0],
                [0, 0, 2, 4],
                [0, 0, 4, 2],
                [0, 0, 0, 0],
            ]);
            board.moveAllTiles('right')
            expect(
                board.serialize(),
            ).to.deep.equal(expectedBoardState);
        })

        it('moves all tiles from top to bottom', function () {
            const board = new BoardState(boardValues);
            const expectedBoardState = ([
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 2, 4, 0],
                [0, 4, 2, 0],
            ]);
            board.moveAllTiles('down');
            expect(
                board.serialize()
            ).to.deep.equal(expectedBoardState);
        });

        it('moves all tiles from bottom to top', function () {
            const board = new BoardState(boardValues);
            const expectedBoardState = [
                [0, 2, 4, 0],
                [0, 4, 2, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ];
            board.moveAllTiles('up');
            expect(
                board.serialize()
            ).to.deep.equal(expectedBoardState);
        });

        it('moves all tiles to the last empty tile in row from right to left', function () {
            const board = new BoardState([
                [0, 0, 4, 2],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            const expectedBoardState = ([
                [4, 2, 0, 0],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            board.moveAllTiles('left');
            expect(
                board.serialize(),
            ).to.deep.equal(expectedBoardState);
        })

        it('merges adjacent tiles when they have the same value', function () {
            const board = new BoardState([
                [2, 2, 0, 0],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            const expectedResult = ([
                [[2, 2], 0, 0, 0],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            board.moveAllTiles('left');
            expect(
                board.serialize()
            ).to.deep.equal(expectedResult);
        })

        it('merges adjacent tiles when they have the same value and place them at last available position', function () {
            const board = new BoardState([
                [0, 2, 2, 0],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            const expectedResult = ([
                [[2, 2], 0, 0, 0],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            board.moveAllTiles('left')
            expect(
                board.serialize()
            ).to.deep.equal(expectedResult);

            const board2 = new BoardState([
                [0, 2, 2, 2],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            const expectedResult2 = ([
                [[2, 2], 2, 0, 0],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);

            board2.moveAllTiles('left')

            expect(
                board2.serialize()
            ).to.deep.equal(expectedResult2);
        })

        it('merges tiles with gap between them when they have the same value and place them at last available position', function () {
            const board = new BoardState([
                [0, 2, 0, 2],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            const expectedResult = ([
                [[2, 2], 0, 0, 0],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            board.moveAllTiles('left');
            expect(
                board.serialize()
            ).to.deep.equal(expectedResult);
        })


        it('merges all tile pairs with the same value and place them at last available position', function () {
            const board = new BoardState([
                [2, 2, 2, 2],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            const expectedResult = ([
                [[2, 2], [2, 2], 0, 0],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            board.moveAllTiles('left');
            expect(
                board.serialize()
            ).to.deep.equal(expectedResult);
        })
    });

})