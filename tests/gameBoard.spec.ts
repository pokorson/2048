import {expect} from 'chai';
import {createBoard, boardHasPossibleMoves, moveTiles} from '../src/gameBoard';

describe('gameBoard', function() {
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

    describe.only('#moveTiles', function() {
        it('moves all tiles from right to left', function() {
            const board = createBoard([
                [0, 2, 8, 4],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            const expectedResult = createBoard([
                [2, 8, 4, 0],
                [4, 2, 4, 8],
                [4, 8, 2, 4],
                [4, 2, 4, 8],
            ]);
            expect(moveTiles(board)).to.deep.equal(expectedResult);
        })

        it('move single tile to the last empty tile in row from right to left', function() {
            const board = createBoard([
                [0, 0, 0, 4],
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
            expect(moveTiles(board)).to.deep.equal(expectedResult);
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
            expect(moveTiles(board)).to.deep.equal(expectedResult);

            const board2 = createBoard([
                [0, 4, 2, 0],
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
            expect(moveTiles(board2)).to.deep.equal(expectedResult2);
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
            expect(moveTiles(board)).to.deep.equal(expectedResult);
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
            expect(moveTiles(board)).to.deep.equal(expectedResult);

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
            expect(moveTiles(board2)).to.deep.equal(expectedResult2);
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
            expect(moveTiles(board)).to.deep.equal(expectedResult);
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
            expect(moveTiles(board)).to.deep.equal(expectedResult);
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
            expect(moveTiles(board)).to.deep.equal(expectedResult);
        })
    });
})