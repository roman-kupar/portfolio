import './Piece.css'

export const PieceColor = {
    White: 'white',
    Black: 'black'
} as const;

export type PieceColor = typeof PieceColor[keyof typeof PieceColor];

export type Position = {r: number, c: number}

export type PieceType = 'King' | 'Queen' | 'Rook' | 'Bishop' | 'Knight' | 'Pawn';

export interface IPiece {
    color: PieceColor
    type: PieceType
    hasAlreadyMoved: boolean
    position: Position
    canMove: (from: Position, to: Position) => boolean
}

export abstract class Piece implements IPiece {
    public color: PieceColor
    public type: PieceType
    public hasAlreadyMoved: boolean = false
    protected _position: Position = {r:0,c:0}

    protected constructor(color: PieceColor, type: PieceType, position: Position) {
        this.color = color
        this.type = type
        this._position = position
    }

    get position() {
        return this._position
    }

    set position({r, c}: Position) {
        this._position = {r, c}
    }

    abstract canMove(from: Position, to: Position) : boolean
}