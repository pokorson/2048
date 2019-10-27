import {expect} from 'chai';
import {createBoard, boardHasPossibleMoves} from '../src/gameBoard';

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
})