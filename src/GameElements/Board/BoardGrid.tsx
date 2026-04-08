import Square from "../Square/Square";
import type {IPiece} from "../Pieces/Piece";
import type {MouseEvent} from "react";

interface BoardGridProps {
    pieces: (IPiece | null)[][];
    activeSquare: {r: number, c: number} | null;
    onSquareMouseDown: (e: MouseEvent, r: number, c: number) => void;
    onSquareMouseUp: (e: MouseEvent, r: number, c: number) => void;
}

export default function BoardGrid({pieces, activeSquare, onSquareMouseDown, onSquareMouseUp}: BoardGridProps) {
    return (
        <>
            {pieces.map((row, r) =>
                row.map((piece, c) => {
                    const isWhite = (r + c) % 2 === 0;
                    const isActive = activeSquare?.r === r && activeSquare?.c === c;
                    return (
                        <Square
                            key={`${r}-${c}`}
                            isWhite={isWhite}
                            piece={piece}
                            onMouseDown={(e) => onSquareMouseDown(e, r, c)}
                            onMouseUp={(e) => onSquareMouseUp(e, r, c)}
                            isActive={isActive}
                        />
                    );
                })
            )}
        </>
    );
}