import {Piece, PieceColor, type Position} from '../../Piece'

export function bishop(from: Position, to: Position) {
    return Math.abs(to.r - from.r) === Math.abs(to.c - from.c);
}

export default class Bishop extends Piece {

    canMove(from: Position, to: Position): boolean {
        return bishop(from, to);
    }

    constructor(color : PieceColor, position: Position ) {
        super(color, 'Bishop', position);
    }
}