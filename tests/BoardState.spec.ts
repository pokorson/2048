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

})