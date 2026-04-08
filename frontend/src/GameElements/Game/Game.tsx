import Board from "../Board/Board"
import { useGameState } from "./GameState";
import type { GameMode } from "../../App/App";
import { useState } from "react";
import { PieceColor, type PieceType } from "../Pieces/Piece";
import { getPieceImage } from "../UI/PieceResourceManager/PieceResourceManager";
import './Game.css';

interface GameProps {
    gameMode?: GameMode;
    onGameWon?: (winner: string) => void;
}

function Game({ gameMode = '2player', onGameWon }: GameProps) {
    const [promotionInfo, setPromotionInfo] = useState<{color: PieceColor, resolve: (type: PieceType) => void} | null>(null);

    const handlePromote = (color: PieceColor): Promise<PieceType> => {
        return new Promise((resolve) => {
            setPromotionInfo({ color, resolve });
        });
    };

    const { gameState, handleMove } = useGameState(onGameWon, handlePromote, gameMode);

    return (
        <div>
            <Board pieces={gameState.board} onMove={(from, to) => handleMove(from, to, gameState)} />

            {promotionInfo && (
                <div className="promotion-overlay">
                    <div className="promotion-modal">
                        <h3>Choose Promotion</h3>
                        <div className="promotion-options">
                            <button 
                                className="promotion-btn" 
                                onClick={() => { promotionInfo.resolve('Queen'); setPromotionInfo(null); }}
                            >
                                <img src={getPieceImage('Queen', promotionInfo.color)} alt="Queen" />
                            </button>
                            <button 
                                className="promotion-btn" 
                                onClick={() => { promotionInfo.resolve('Knight'); setPromotionInfo(null); }}
                            >
                                <img src={getPieceImage('Knight', promotionInfo.color)} alt="Knight" />
                            </button>
                            <button 
                                className="promotion-btn" 
                                onClick={() => { promotionInfo.resolve('Rook'); setPromotionInfo(null); }}
                            >
                                <img src={getPieceImage('Rook', promotionInfo.color)} alt="Rook" />
                            </button>
                            <button 
                                className="promotion-btn" 
                                onClick={() => { promotionInfo.resolve('Bishop'); setPromotionInfo(null); }}
                            >
                                <img src={getPieceImage('Bishop', promotionInfo.color)} alt="Bishop" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Game