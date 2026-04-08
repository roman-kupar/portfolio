import {Piece, PieceColor, type Position} from '../../Piece'
import type {BoardState} from "../../../Board/Board";
import type {IPiece} from '../../Piece';

export default class Pawn extends Piece {

    canMove(from: Position, to: Position): boolean {
        return this.canPawnMove(from, to);
    }

    canPawnMove(from: Position, to: Position, board?: BoardState, lastMove?: { piece: IPiece, from: Position, to: Position }): boolean {
        const dr = to.r - from.r;
        const dc = to.c - from.c;
        const absDc = Math.abs(dc);
        const direction = this.color === PieceColor.White ? -1 : 1;
        const startRow = this.color === PieceColor.White ? 6 : 1;

        if (dr === direction && absDc === 0) {
            return board ? board[to.r][to.c] === null : true;
        }

        if (dr === 2 * direction && absDc === 0 && from.r === startRow) {
            if (!board) return true;
            const intermediateRow = from.r + direction;
            return board[to.r][to.c] === null && board[intermediateRow][from.c] === null;
        }

        if (dr === direction && absDc === 1) {
            if (!board) return true;

            const targetPiece = board[to.r][to.c];

            // Normal diagonal capture
            if (targetPiece !== null && targetPiece.color !== this.color) return true;

            // En passant capture
            if (targetPiece === null && lastMove) {
                const isLastMovePawn = lastMove.piece.type === 'Pawn';
                const isDoubleStep = Math.abs(lastMove.from.r - lastMove.to.r) === 2;
                const isAdjacent = lastMove.to.r === from.r && lastMove.to.c === to.c;

                if (isLastMovePawn && isDoubleStep && isAdjacent) {
                    return true;
                }
            }

            return false;
        }

        return false;
    }

    constructor(color : PieceColor, position: Position) {
        super(color, 'Pawn', position);
    }
}