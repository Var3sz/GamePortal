import * as React from 'react';
import { useState, useRef } from 'react';
import { Container } from 'react-bootstrap';
import Tile from './Tile';
import { ROWS, COLS, TILE_SIZE } from '../../constants/ChessConstants';
import { Position } from '../../models/chess/Position';
import { Piece } from '../../models/chess/Pieces';

interface ChessBoardProps {
    makeMove: (piece: Piece, desiredPos: Position) => boolean;
    pieces: Piece[]
}

export const ChessBoard = ({ makeMove, pieces }: ChessBoardProps) => {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [grabPos, setGrabPos] = useState<Position>(new Position(-1, -1));
    const chessboardRef = useRef<HTMLDivElement>(null);

    // We grab the pieces when mouseDown event triggers
    function grabPiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        const element = e.target as HTMLElement;

        if (element.classList.contains("chess-piece") && chessboard) {
            const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / TILE_SIZE);
            const grabY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 600) / TILE_SIZE));
            setGrabPos(new Position(grabX, grabY));

            console.log(grabX, grabY);

            const x = e.clientX - TILE_SIZE / 2;
            const y = e.clientY - TILE_SIZE / 2;
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            setActivePiece(element);
        }
    }

    // We move the pieces when mouseMove event triggers
    function movePiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const minX = chessboard.offsetLeft - 10;
            const minY = chessboard.offsetTop - 10;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 62.5;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 67.5;
            const x = e.clientX - 37.5;
            const y = e.clientY - 37.5;
            activePiece.style.position = "absolute";

            if (x < minX) {
                activePiece.style.left = `${minX}px`;
            } else if (x > maxX) {
                activePiece.style.left = `${maxX}px`;
            } else {
                activePiece.style.left = `${x}px`;
            }

            if (y < minY) {
                activePiece.style.top = `${minY}px`;
            } else if (y > maxY) {
                activePiece.style.top = `${maxY}px`;
            } else {
                activePiece.style.top = `${y}px`;
            }
        }
    }

    // We drop the pieces, when mouseUp event triggers
    function dropPiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;

        if (activePiece && chessboard) {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / TILE_SIZE);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 600) / TILE_SIZE));
            const currentPiece = pieces.find((p) => p.samePosition(grabPos));

            if (currentPiece) {
                var successfulMove = makeMove(currentPiece.clone(), new Position(x, y));

                if (!successfulMove) {
                    activePiece.style.position = "relative";
                    activePiece.style.removeProperty("top");
                    activePiece.style.removeProperty("left");
                }
            }
            setActivePiece(null);
        }
    }


    // Initialize board
    let board: any = [];

    for (let j = COLS.length - 1; j >= 0; j--) {
        for (let i = 0; i < ROWS.length; i++) {
            const number = j + i + 2;
            const piece = pieces.find((p) =>
                p.samePosition(new Position(i, j))
            );
            let image = piece ? piece.image : undefined;
            let currentPiece = activePiece != null ? pieces.find(p => p.samePosition(grabPos)) : undefined;
            let highlight = currentPiece?.availableMoves ? currentPiece.availableMoves.some(p => p.samePosition(new Position(i, j))) : false;
            board.push(<Tile key={`${j},${i}`} image={image} number={number} highlight={highlight} />);
        }
    }

    return (
        <>
            <Container
                onMouseMove={e => movePiece(e)}
                onMouseDown={e => grabPiece(e)}
                onMouseUp={e => dropPiece(e)}
                id="chessboard"
                ref={chessboardRef}
            >
                {board}
            </Container>
        </>
    );
}

export default ChessBoard;