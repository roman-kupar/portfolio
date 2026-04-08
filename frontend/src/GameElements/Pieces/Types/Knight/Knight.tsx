import {Piece, PieceColor, type Position} from '../../Piece'


export default class Knight extends Piece {

    canMove(from: Position, to: Position): boolean {
        const dr = Math.abs(to.r - from.r);
        const dc = Math.abs(to.c - from.c);

        return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
    }

    constructor(color : PieceColor, position: Position) {
        super(color, 'Knight', position);
    }
}