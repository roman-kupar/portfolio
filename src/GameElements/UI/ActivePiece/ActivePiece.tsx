import {useEffect, useState} from 'react';
import type {IPiece} from "../../Pieces/Piece";
import './ActivePiece.css';
import {getPieceImage} from "../PieceResourceManager/PieceResourceManager";

interface ActivePieceProps {
    piece: IPiece | null
    initialCoords: {x: number, y: number} | null
}

export default function ActivePiece({piece, initialCoords}: ActivePieceProps) {
    const [coords, setCoords] = useState(initialCoords || {x: 0, y: 0});

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setCoords({
                x: e.clientX,
                y: e.clientY
            });
        };

        if (piece) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [piece]);

    if (!piece) return null;

    return (
        <img
            src={getPieceImage(piece.type, piece.color)}
            alt="Active Piece"
            className="active-piece"
            style={{
                top: coords.y,
                left: coords.x,
            }}
        />
    );
}