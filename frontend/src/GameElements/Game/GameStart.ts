import {type IPiece, PieceColor} from "../Pieces/Piece";
import PieceFactory from "../Pieces/PieceFactory";
import type {GameState} from "./GameState";
import type {BoardState} from "../Board/Board";

export function getInitialGameState(): GameState {
    const factory = new PieceFactory();
    const board: BoardState = Array.from({ length: 8 }, () => Array(8).fill(null));
    const whitePieces: IPiece[] = [];
    const blackPieces: IPiece[] = [];

    // Black pieces
    board[0][0] = factory.createPiece('Rook', PieceColor.Black, {r: 0, c: 0});
    board[0][1] = factory.createPiece('Knight', PieceColor.Black, {r: 0, c: 1});
    board[0][2] = factory.createPiece('Bishop', PieceColor.Black, {r: 0, c: 2});
    board[0][3] = factory.createPiece('Queen', PieceColor.Black, {r: 0, c: 3});
    const blackKing = factory.createPiece('King', PieceColor.Black, {r: 0, c: 4});
    board[0][4] = blackKing;
    board[0][5] = factory.createPiece('Bishop', PieceColor.Black, {r: 0, c: 5});
    board[0][6] = factory.createPiece('Knight', PieceColor.Black, {r: 0, c: 6});
    board[0][7] = factory.createPiece('Rook', PieceColor.Black, {r: 0, c: 7});
    for (let c = 0; c < 8; c++) {
        board[1][c] = factory.createPiece('Pawn', PieceColor.Black, {r: 1, c});
    }

    // White pieces
    board[7][0] = factory.createPiece('Rook', PieceColor.White, {r: 7, c: 0});
    board[7][1] = factory.createPiece('Knight', PieceColor.White, {r: 7, c: 1});
    board[7][2] = factory.createPiece('Bishop', PieceColor.White, {r: 7, c: 2});
    board[7][3] = factory.createPiece('Queen', PieceColor.White, {r: 7, c: 3});
    const whiteKing = factory.createPiece('King', PieceColor.White, {r: 7, c: 4});
    board[7][4] = whiteKing;
    board[7][5] = factory.createPiece('Bishop', PieceColor.White, {r: 7, c: 5});
    board[7][6] = factory.createPiece('Knight', PieceColor.White, {r: 7, c: 6});
    board[7][7] = factory.createPiece('Rook', PieceColor.White, {r: 7, c: 7});
    for (let c = 0; c < 8; c++) {
        board[6][c] = factory.createPiece('Pawn', PieceColor.White, {r: 6, c});
    }

    board.flat().forEach(piece => {
        if (piece) {
            if (piece.color === PieceColor.White) {
                whitePieces.push(piece);
            } else {
                blackPieces.push(piece);
            }
        }
    });

    return { board, whitePieces, blackPieces, whiteKing, blackKing };
}