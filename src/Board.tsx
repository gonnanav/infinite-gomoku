import { useState, type PointerEvent } from 'react';
import { Intersection } from './Intersection.tsx';
import { type Coordinate, type IntersectionState, boardSize } from './board.ts';
import classes from './Board.module.css';

const intersections = boardSize * boardSize;
const initialStones = new Set<string>();

export function Board() {
  const { stateAt, placeStone, previewStone, clearPreview } = useBoard();

  // Clicking previews an intersection; clicking the same one again places a stone.
  // On desktop the pointer hover previews, so a single click places.
  function previewOrPlace(coordinate: Coordinate) {
    const state = stateAt(coordinate);
    if (state === 'black') {
      clearPreview();
    } else if (state === 'preview') {
      placeStone(coordinate);
    } else {
      previewStone(coordinate);
    }
  }

  // Only a mouse hovers, so this previews on desktop without affecting touch taps.
  function handleIntersectionPointerEnter(event: PointerEvent, coordinate: Coordinate) {
    if (event.pointerType !== 'mouse') return;

    if (stateAt(coordinate) === 'black') {
      clearPreview();
    } else {
      previewStone(coordinate);
    }
  }

  function handleBoardPointerLeave(event: PointerEvent) {
    if (event.pointerType !== 'mouse') return;

    clearPreview();
  }

  return (
    <div className={classes.root}>
      <div className={classes.board} onPointerLeave={handleBoardPointerLeave}>
        {Array.from({ length: intersections }, (_, i) => {
          const row = Math.floor(i / boardSize);
          const col = i % boardSize;
          const coordinate = { row, col };

          return (
            <Intersection
              key={coordinateKey(coordinate)}
              coordinate={coordinate}
              state={stateAt(coordinate)}
              onPointerEnter={handleIntersectionPointerEnter}
              onClick={previewOrPlace}
            />
          );
        })}
      </div>
    </div>
  );
}

function useBoard() {
  const [stones, setStones] = useState(initialStones);
  const [previewedStone, setPreviewedStone] = useState<Coordinate | null>(null);

  function stateAt(coordinate: Coordinate): IntersectionState {
    if (stones.has(coordinateKey(coordinate))) return 'black';
    if (previewedStone !== null && coordinatesEqual(previewedStone, coordinate)) return 'preview';
    return 'empty';
  }

  function placeStone(coordinate: Coordinate) {
    setStones((prev) => new Set(prev).add(coordinateKey(coordinate)));
    setPreviewedStone(null);
  }

  function previewStone(coordinate: Coordinate) {
    setPreviewedStone(coordinate);
  }

  function clearPreview() {
    setPreviewedStone(null);
  }

  return { stateAt, placeStone, previewStone, clearPreview };
}

function coordinateKey({ row, col }: Coordinate) {
  return `${row},${col}`;
}

function coordinatesEqual(a: Coordinate, b: Coordinate) {
  return a.row === b.row && a.col === b.col;
}
