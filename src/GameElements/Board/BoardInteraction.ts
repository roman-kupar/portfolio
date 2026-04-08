import { useState, useEffect, useRef, useCallback, type MouseEvent } from 'react';
import type {BoardState} from "./Board";

interface UseBoardInteractionProps {
    pieces: BoardState;
    onMove: (from: { r: number, c: number }, to: { r: number, c: number }) => void;
}

export function useBoardInteraction({ pieces, onMove }: UseBoardInteractionProps) {
    const [activeSquare, setActiveSquare] = useState<{r: number, c: number} | null>(null);
    const [clickCoords, setClickCoords] = useState<{x: number, y: number} | null>(null);

    const hasMovedAway = useRef(false);
    const startCoords = useRef<{x: number, y: number} | null>(null);
    const wasActiveAtStart = useRef(false);
    const cleanupFn = useRef<(() => void) | null>(null);

    const activePiece = activeSquare ? pieces[activeSquare.r][activeSquare.c] : null;

    useEffect(() => {
        const handleRightClick = (e: globalThis.MouseEvent) => {
            if (e.button === 2) {
                setActiveSquare(null);
                setClickCoords(null);
            }
        };

        if (activeSquare) {
            window.addEventListener('mousedown', handleRightClick);
        }

        return () => {
            window.removeEventListener('mousedown', handleRightClick);
        };
    }, [activeSquare]);

    useEffect(() => {
        if (!activeSquare && cleanupFn.current) {
            cleanupFn.current();
            cleanupFn.current = null;
        }
    }, [activeSquare]);

    const handleDragCheck = useCallback((e: globalThis.MouseEvent) => {
        if (startCoords.current) {
            const dist = Math.sqrt(Math.pow(e.clientX - startCoords.current.x, 2) + Math.pow(e.clientY - startCoords.current.y, 2));
            if (dist > 5) {
                hasMovedAway.current = true;
            }
        }
    }, []);

    const handleMouseDown = useCallback((e: MouseEvent, r: number, c: number) => {
        if (e.button !== 0) return;

        hasMovedAway.current = false;
        startCoords.current = {x: e.clientX, y: e.clientY};
        wasActiveAtStart.current = !!activeSquare;

        const cleanup = () => {
            window.removeEventListener('mousemove', handleDragCheck);
            window.removeEventListener('mouseup', cleanup);
        };
        cleanupFn.current = cleanup;

        window.addEventListener('mousemove', handleDragCheck);
        window.addEventListener('mouseup', cleanup);

        const clickedPiece = pieces[r][c];
        
        if (activeSquare) {
            const currentActivePiece = pieces[activeSquare.r][activeSquare.c];
            
            if (activeSquare.r === r && activeSquare.c === c) {
                setClickCoords({x: e.clientX, y: e.clientY});
            } else if (clickedPiece && currentActivePiece && clickedPiece.color === currentActivePiece.color) {
                setActiveSquare({r, c});
                setClickCoords({x: e.clientX, y: e.clientY});
            }
        } else if (clickedPiece) {
            setClickCoords({x: e.clientX, y: e.clientY});
            setActiveSquare({r, c});
        }
    }, [activeSquare, pieces, handleDragCheck]);

    const handleMouseUp = useCallback((_e: MouseEvent, r: number, c: number) => {
        if (cleanupFn.current) {
            cleanupFn.current();
            cleanupFn.current = null;
        }

        if (activeSquare) {
            if (activeSquare.r !== r || activeSquare.c !== c) {
                onMove(activeSquare, {r, c});
                setActiveSquare(null);
                setClickCoords(null);
            } else {
                if (hasMovedAway.current) {
                    setActiveSquare(null);
                    setClickCoords(null);
                } else if (wasActiveAtStart.current) {
                    setActiveSquare(null);
                    setClickCoords(null);
                }
            }
        }
    }, [activeSquare, onMove]);

    const handleContextMenu = useCallback((e: MouseEvent) => {
        e.preventDefault();
    }, []);

    return {
        activeSquare,
        clickCoords,
        activePiece,
        handleMouseDown,
        handleMouseUp,
        handleContextMenu
    };
}