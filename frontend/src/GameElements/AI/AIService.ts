import type { GameState, Turn } from "../Game/GameState";
import {toFEN} from "../Util/Util";
import {PieceColor} from "../Pieces/Piece";

export interface AIMove {
    from: { r: number; c: number };
    to: { r: number; c: number };
}

// If VITE_AI_SERVICE_URL is defined (even as an empty string), use it. 
// Otherwise, fall back to localhost:5000.
const envUrl = import.meta.env.VITE_AI_SERVICE_URL;
const AI_SERVICE_URL = envUrl !== undefined ? envUrl : "http://localhost:5000";

export const ai = {
    async makeMove(gameState: GameState, currentTurn: Turn = PieceColor.Black): Promise<AIMove> {
        try {
            const fenNotation = toFEN(gameState, currentTurn);

            const response = await fetch(`${AI_SERVICE_URL}/api/move`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fen: fenNotation }),
            });

            if (!response.ok) {
                throw new Error(`AI Service error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.move;
        } catch (error) {
            console.error('Error getting AI move:', error);
            throw error;
        }
    },
};