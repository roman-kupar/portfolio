import whiteKing from '../../../assets/pieces/w_king_png_128px.png'
import blackKing from '../../../assets/pieces/b_king_png_128px.png'
import whiteQueen from '../../../assets/pieces/w_queen_png_128px.png'
import blackQueen from '../../../assets/pieces/b_queen_png_128px.png'
import whiteRook from '../../../assets/pieces/w_rook_png_128px.png'
import blackRook from '../../../assets/pieces/b_rook_png_128px.png'
import whiteBishop from '../../../assets/pieces/w_bishop_png_128px.png'
import blackBishop from '../../../assets/pieces/b_bishop_png_128px.png'
import whiteKnight from '../../../assets/pieces/w_knight_png_128px.png'
import blackKnight from '../../../assets/pieces/b_knight_png_128px.png'
import whitePawn from '../../../assets/pieces/w_pawn_png_128px.png'
import blackPawn from '../../../assets/pieces/b_pawn_png_128px.png'
import {PieceColor} from "../../Pieces/Piece";

export type PieceType = 'King' | 'Queen' | 'Rook' | 'Bishop' | 'Knight' | 'Pawn';

export const PieceImages: Record<PieceType, Record<PieceColor, string>> = {
    King: {
        [PieceColor.White]: whiteKing,
        [PieceColor.Black]: blackKing
    },
    Queen: {
        [PieceColor.White]: whiteQueen,
        [PieceColor.Black]: blackQueen
    },
    Rook: {
        [PieceColor.White]: whiteRook,
        [PieceColor.Black]: blackRook
    },
    Bishop: {
        [PieceColor.White]: whiteBishop,
        [PieceColor.Black]: blackBishop
    },
    Knight: {
        [PieceColor.White]: whiteKnight,
        [PieceColor.Black]: blackKnight
    },
    Pawn: {
        [PieceColor.White]: whitePawn,
        [PieceColor.Black]: blackPawn
    }
};

export function getPieceImage(type: PieceType, color: PieceColor): string {
    return PieceImages[type][color];
}