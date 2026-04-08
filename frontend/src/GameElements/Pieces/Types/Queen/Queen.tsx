import {Piece, PieceColor, type Position} from '../../Piece'
import {bishop} from "../Bishop/Bishop"
import {rook} from "../Rook/Rook"

export default class Queen extends Piece {

    canMove(from: Position, to: Position): boolean {
        return bishop(from, to) || rook(from, to);
    }

    constructor(color : PieceColor, position: Position) {
        super(color, 'Queen', position);
    }

}