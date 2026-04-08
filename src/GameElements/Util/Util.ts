import type { GameState, Turn } from '../Game/GameState';
import { PieceColor } from '../Pieces/Piece';


export function toFEN(gameState: GameState, currentTurn: Turn): string {
    const fenParts: string[] = [];

    fenParts.push(getPiecePlacement(gameState));

    fenParts.push(currentTurn === PieceColor.White ? 'w' : 'b');


    //fenParts.push('-');

    //fenParts.push('-');

    //fenParts.push('0');


    //fenParts.push('1');

    return fenParts.join(' ');
}

function getPiecePlacement(gameState: GameState): string {
    const fenRanks: string[] = [];

    for (let rank = 0; rank < 8; rank++) {
        let fenRank = '';
        let emptySquares = 0;

        for (let file = 0; file < 8; file++) {
            const piece = gameState.board[rank][file];

            if (piece) {
                if (emptySquares > 0) {
                    fenRank += emptySquares;
                    emptySquares = 0;
                }
                fenRank += getPieceCharacter(piece.type, piece.color);
            } else {
                emptySquares++;
            }
        }

        if (emptySquares > 0) {
            fenRank += emptySquares;
        }

        fenRanks.push(fenRank);
    }

    return fenRanks.join('/');
}


function getPieceCharacter(type: string, color: string): string {
    const pieceMap: { [key: string]: string } = {
        King: 'K',
        Queen: 'Q',
        Rook: 'R',
        Bishop: 'B',
        Knight: 'N',
        Pawn: 'P',
    };

    const character = pieceMap[type] || '?';
    return color === PieceColor.White ? character : character.toLowerCase();
}
