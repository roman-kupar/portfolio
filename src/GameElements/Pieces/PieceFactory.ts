import {type IPiece, PieceColor, type Position} from './Piece'
import King from './Types/King/King'
import Queen from './Types/Queen/Queen'
import Bishop from './Types/Bishop/Bishop'
import Rook from './Types/Rook/Rook'
import Knight from './Types/Knight/Knight'
import Pawn from "./Types/Pawn/Pawn";

type PieceType = 'King' | 'Queen' | 'Pawn' | 'Bishop' | 'Rook' | 'Knight'

export default class Factory {
    public createPiece(t : PieceType, color: PieceColor, position: Position): IPiece {
        switch (t) {
            case 'King':
                return new King(color, position)
            case 'Queen':
                return new Queen(color, position)
            case 'Pawn':
                return new Pawn(color, position)
            case 'Rook':
                return new Rook(color, position)
            case 'Bishop':
                return new Bishop(color, position)
            case 'Knight':
                return new Knight(color, position)
        }
    }
}