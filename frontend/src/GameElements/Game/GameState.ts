import { useState, useCallback } from 'react';
import {type IPiece, PieceColor, type Position, type PieceType} from "../Pieces/Piece";
import { isValidMove, executeMove, isCheckmate } from "./GameLogic";
import { getInitialGameState } from "./GameStart";
import type {BoardState} from "../Board/Board";
import PieceFactory from "../Pieces/PieceFactory";

export type GameState = {
    board: BoardState;
    whitePieces: IPiece[];
    blackPieces: IPiece[];
    whiteKing: IPiece;
    blackKing: IPiece;
    lastMove?: {
        piece: IPiece;
        from: Position;
        to: Position;
    };
};
export type Turn = PieceColor;

export function useGameState(
    onGameWon?: (winner: string) => void, 
    onPromote?: (color: PieceColor) => Promise<PieceType>
) {
    const [gameState, setGameState] = useState<GameState>(() => getInitialGameState());
    const [turn, setTurn] = useState<Turn>(PieceColor.White);

    const executePlayerMove = useCallback(async (from: {r: number, c: number}, to: {r: number, c: number}, currentState: GameState) => {
        if (isValidMove(from, to, currentState.board, turn, currentState)) {
            const targetPiece = currentState.board[to.r][to.c]; // Capture check before move
            const newBoard = executeMove(from, to, currentState.board);
            
            let movingPiece = newBoard[to.r][to.c];
            if (movingPiece) {
                movingPiece.position = {r: to.r, c: to.c};
                movingPiece.hasAlreadyMoved = true;

                // Handle Pawn Promotion
                if (movingPiece.type === 'Pawn' && (to.r === 0 || to.r === 7)) {
                    let promotedType: PieceType = 'Queen'; // Default
                    
                    if (onPromote) {
                        promotedType = await onPromote(movingPiece.color);
                    }

                    const factory = new PieceFactory();
                    const promotedPiece = factory.createPiece(promotedType, movingPiece.color, {r: to.r, c: to.c});
                    newBoard[to.r][to.c] = promotedPiece;
                    movingPiece = promotedPiece;
                }
            }

            let whitePieces = currentState.whitePieces;
            let blackPieces = currentState.blackPieces;

            // Remove captured piece
            if (targetPiece) {
                if (targetPiece.color === PieceColor.White) {
                    whitePieces = whitePieces.filter(p => p !== targetPiece);
                } else {
                    blackPieces = blackPieces.filter(p => p !== targetPiece);
                }
            }
            
            // Handle en passant capture removal from lists
            // If the move was a pawn moving diagonally to an empty square
            if (movingPiece && movingPiece.type === 'Pawn' && Math.abs(from.c - to.c) === 1 && !targetPiece) {
                const capturedPawn = currentState.board[from.r][to.c];
                if (capturedPawn) {
                    if (capturedPawn.color === PieceColor.White) {
                        whitePieces = whitePieces.filter(p => p !== capturedPawn);
                    } else {
                        blackPieces = blackPieces.filter(p => p !== capturedPawn);
                    }
                }
            }

            // Update piece lists if promotion happened
            if (movingPiece && movingPiece.type !== 'Pawn' && currentState.board[from.r][from.c]?.type === 'Pawn') {
                if (movingPiece.color === PieceColor.White) {
                    whitePieces = whitePieces.filter(p => p !== currentState.board[from.r][from.c]);
                    whitePieces.push(movingPiece);
                } else {
                    blackPieces = blackPieces.filter(p => p !== currentState.board[from.r][from.c]);
                    blackPieces.push(movingPiece);
                }
            }

            const nextGameState: GameState = {
                ...currentState,
                board: newBoard,
                whitePieces,
                blackPieces,
                lastMove: movingPiece ? { piece: movingPiece, from, to } : undefined
            };

            setGameState(nextGameState);
            
            const nextTurn = turn === PieceColor.White ? PieceColor.Black : PieceColor.White;
            setTurn(nextTurn);

            if (isCheckmate(nextGameState, nextTurn)) {
                if (onGameWon) {
                    onGameWon(turn === PieceColor.White ? "White" : "Black");
                }
            }
        } else {
            console.warn("Invalid move attempted:", from, to);
        }
    }, [turn, onGameWon, onPromote]);

    const handleMove = useCallback((from: {r: number, c: number}, to: {r: number, c: number}, currentState: GameState) => {
        executePlayerMove(from, to, currentState);
    }, [executePlayerMove]);

    return { gameState, handleMove };
}