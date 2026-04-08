import './Board.css'
import ActivePiece from "../UI/ActivePiece/ActivePiece";
import type {IPiece} from "../Pieces/Piece";
import BoardGrid from "./BoardGrid";
import {useBoardInteraction} from "./BoardInteraction";

export type BoardState = (IPiece | null)[][];

interface BoardProps {
    pieces: BoardState;
    onMove: (from: { r: number, c: number }, to: { r: number, c: number }) => void;
}

function Board({pieces, onMove} : BoardProps) {
    const {
        activeSquare,
        clickCoords,
        activePiece,
        handleMouseDown,
        handleMouseUp,
        handleContextMenu
    } = useBoardInteraction({ pieces, onMove });

    return (
        <div className="Board" onContextMenu={handleContextMenu}>
            <BoardGrid
                pieces={pieces}
                activeSquare={activeSquare}
                onSquareMouseDown={handleMouseDown}
                onSquareMouseUp={handleMouseUp}
            />
            {activePiece && <ActivePiece piece={activePiece} initialCoords={clickCoords}/>}
        </div>
    )
}

export default Board