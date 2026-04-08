import {Piece, PieceColor, type Position} from '../../Piece';

export function rook(from: Position, to: Position) {
    return from.r === to.r || from.c === to.c;
}

export default class Rook extends Piece {

    canMove(from: Position, to: Position): boolean {
        return rook(from, to);
    }

    constructor(color : PieceColor, position: Position) {
        super(color, 'Rook', position);
    }
}