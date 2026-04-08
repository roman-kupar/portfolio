import {Piece, PieceColor, type Position} from '../../Piece'
import {isPathClear} from "../../../Game/GameLogic"

import type {GameState} from "../../../Game/GameState";

export default class King extends Piece {

    canMove(from: Position, to: Position): boolean {
        return Math.abs(to.r - from.r) <= 1 && Math.abs(to.c - from.c) <= 1;
    }

    isKingUnderCheck(state : GameState): boolean {
        return this.isSquareUnderAttack(state, this.position);
    }

    isSquareUnderAttack(state: GameState, square: Position): boolean {
        const opponentPieces = this.color === PieceColor.White ? state.blackPieces : state.whitePieces;

        for (const piece of opponentPieces) {
            // Pawn attack logic is different from its move logic
            if (piece.type === 'Pawn') {
                const direction = piece.color === PieceColor.White ? -1 : 1;
                const dr = square.r - piece.position.r;
                const dc = Math.abs(square.c - piece.position.c);
                if (dr === direction && dc === 1) {
                    return true;
                }
            } else {
                if (piece.canMove(
                    { r: piece.position.r, c: piece.position.c },
                    square
                ) && isPathClear(
                    { r: piece.position.r, c: piece.position.c },
                    square,
                    state.board
                )) {
                    return true;
                }
            }
        }

        return false;
    }

    canCastle(state : GameState, to: Position): boolean {

        if (this.hasAlreadyMoved) return false;

        if (this.isKingUnderCheck(state)) {
            return false;
        }

        const isRightSquare =
            this.color === PieceColor.White
                ? (to.r === 7 && to.c === 6) || (to.r === 7 && to.c === 2)
                : (to.r === 0 && to.c === 6) || (to.r === 0 && to.c === 2);

        if (!isRightSquare) return false;

        const isKingside = to.c === 6;
        const rookCol   = isKingside ? 7 : 0;
        const rook      = state.board[to.r][rookCol];

        // Rook must be present and unmoved
        if (!rook || rook.type !== 'Rook' || rook.hasAlreadyMoved) return false;

        // All squares between king and rook must be empty
        const [minCol, maxCol] = isKingside ? [5, 6] : [1, 3];
        for (let c = minCol; c <= maxCol; c++) {

            if (state.board[to.r][c] !== null) {
                console.log("smth on the way")
                return false;
            }
        }

        // King must not pass through or land on an attacked square
        const kingPassCols = isKingside ? [5, 6] : [2, 3];
        for (const c of kingPassCols) {
            if (this.isSquareUnderAttack(state, { r: to.r, c })) return false;
        }

        return true;
    }

    constructor(color : PieceColor, position: Position) {
        super(color, 'King', position);
    }
}