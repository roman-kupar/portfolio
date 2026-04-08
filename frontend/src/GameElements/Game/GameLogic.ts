import {type IPiece, PieceColor} from "../Pieces/Piece";
import Pawn from "../Pieces/Types/Pawn/Pawn";
import type {GameState} from "./GameState";
import King from "../Pieces/Types/King/King";
import type {BoardState} from "../Board/Board";

export function isPathClear(from: {r: number, c: number}, to: {r: number, c: number}, board: BoardState): boolean {
    const dr = to.r - from.r;
    const dc = to.c - from.c;
    const absDr = Math.abs(dr);
    const absDc = Math.abs(dc);

    // If not a straight line (horizontal, vertical, or diagonal), skip path check - Knight
    if (dr !== 0 && dc !== 0 && absDr !== absDc) {
        return true;
    }

    const stepR = dr === 0 ? 0 : dr / absDr;
    const stepC = dc === 0 ? 0 : dc / absDc;

    let currentR = from.r + stepR;
    let currentC = from.c + stepC;

    while (currentR !== to.r || currentC !== to.c) {
        if (board[currentR][currentC]) {
            return false; // Path blocked
        }
        currentR += stepR;
        currentC += stepC;
    }

    return true;
}

export function isFriendlyFire(to: {r: number, c: number}, movingPiece: IPiece, board: BoardState): boolean {
    const targetPiece = board[to.r][to.c];
    return !!(targetPiece && targetPiece.color === movingPiece.color);
}

export function isValidMove(from: {r: number, c: number}, to: {r: number, c: number}, board: BoardState, turn: PieceColor, currentState: GameState): boolean {
    const movingPiece = board[from.r][from.c];
    
    if (!movingPiece || movingPiece.color !== turn) return false;

    if (isFriendlyFire(to, movingPiece, board)) {
        return false;
    }

    if (!isPathClear(from, to, board)) {
        return false;
    }

    let isCastling = false;

    if (movingPiece instanceof Pawn) {
        if (!movingPiece.canPawnMove(from, to, board, currentState.lastMove)) {
            return false;
        }
    } else if (movingPiece instanceof King) {
        isCastling = movingPiece.canCastle(currentState, to);
        if (!movingPiece.canMove(from, to) && !isCastling) {
            return false;
        }
    } else {
        if (!movingPiece.canMove(from, to)) {
            return false;
        }
    }

    const originalPosition = movingPiece.position;

    const fictionalBoard = executeMove(from, to, board);
    const movingPieceAfterMove = fictionalBoard[to.r][to.c];
    if (movingPieceAfterMove) {
        movingPieceAfterMove.position = {r: to.r, c: to.c};
    }

    const whitePieces = fictionalBoard.flat().filter(p => p?.color === PieceColor.White) as IPiece[];
    const blackPieces = fictionalBoard.flat().filter(p => p?.color === PieceColor.Black) as IPiece[];

    const fictionalGameState: GameState = {
        ...currentState,
        board: fictionalBoard,
        whitePieces,
        blackPieces,
    };

    const king = turn === PieceColor.White ? fictionalGameState.whiteKing : fictionalGameState.blackKing;

    let isCheck = false;
    if (king instanceof King) {
        isCheck = king.isKingUnderCheck(fictionalGameState);
    }

    if (movingPieceAfterMove) {
        movingPieceAfterMove.position = originalPosition;
    }

    return !isCheck;
}

export function isCheckmate(gameState: GameState, turn: PieceColor): boolean {
    const king = turn === PieceColor.White ? gameState.whiteKing : gameState.blackKing;

    if (king instanceof King && !king.isKingUnderCheck(gameState)) {
        return false;
    }

    const pieces = turn === PieceColor.White ? gameState.whitePieces : gameState.blackPieces;

    for (const piece of pieces) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const from = { r: piece.position.r, c: piece.position.c };
                const to = { r, c };

                if (from.r === to.r && from.c === to.c) continue;

                if (isValidMove(from, to, gameState.board, turn, gameState)) {
                    return false;
                }
            }
        }
    }

    return true;
}


export function executeMove(from: {r: number, c: number}, to: {r: number, c: number}, board: BoardState): BoardState {
    const newPieces = board.map(row => [...row]);
    const movingPiece = newPieces[from.r][from.c];

    if (movingPiece) {
        // Handle castling rook movement
        if (movingPiece instanceof King && Math.abs(to.c - from.c) === 2) {
            const isKingside = to.c === 6;
            const rookFromCol = isKingside ? 7 : 0;
            const rookToCol = isKingside ? 5 : 3;

            const rook = newPieces[from.r][rookFromCol];
            if (rook) {
                newPieces[from.r][rookFromCol] = null;
                newPieces[from.r][rookToCol] = rook;
                // Position update for the rook should ideally happen when integrating the state, 
                // but the UI only relies on the array position for rendering normally.
            }
        }

        // Handle en passant capture (Pawn moves diagonally to an empty square)
        if (movingPiece instanceof Pawn && Math.abs(from.c - to.c) === 1 && newPieces[to.r][to.c] === null) {
            // The captured pawn is on the same row as the moving pawn started, but in the destination column
            newPieces[from.r][to.c] = null;
        }

        newPieces[from.r][from.c] = null;
        newPieces[to.r][to.c] = movingPiece;
    }

    return newPieces;
}