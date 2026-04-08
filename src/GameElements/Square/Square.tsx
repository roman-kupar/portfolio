import w_square from '../../assets/squares/w_square.svg'
import b_square from '../../assets/squares/b_square.svg'
import './Square.css'
import '../Pieces/Piece.css'
import type {IPiece} from "../Pieces/Piece";
import type {MouseEvent} from "react";
import {getPieceImage} from "../UI/PieceResourceManager/PieceResourceManager";

interface SquareProps {
    isWhite : boolean
    piece : IPiece | null
    onMouseDown: (event: MouseEvent) => void
    onMouseUp: (event: MouseEvent) => void
    isActive?: boolean
}

function Square ({isWhite, piece, onMouseDown, onMouseUp, isActive} : SquareProps) {
    return (
        <button className="square" onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
            <div className="inner" style={{position: 'relative'}}>
                <img
                    src = {isWhite ? w_square : b_square}
                    alt = {isWhite ? "White Square" : "Black Square"}
                />
                {piece && !isActive && (
                    <img
                        className="piece"
                        src={getPieceImage(piece.type, piece.color)}
                        alt={`${piece.color} piece`}
                    />
                )}
            </div>
        </button>
    )
}

export default Square