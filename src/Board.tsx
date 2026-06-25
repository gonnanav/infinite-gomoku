import { useState, type PointerEvent } from 'react';
import clsx from 'clsx';
import classes from './Board.module.css';

const size = 15; // intersections per side
const intersections = size * size;
const lastIndex = size - 1;

const initialStones = new Set<number>();

function Board() {
  const [stones, setStones] = useState(initialStones);
  const [previewedStone, setPreviewedStone] = useState<number | null>(null);

  function isPlaced(i: number) {
    return stones.has(i);
  }

  function isPreviewed(i: number) {
    return previewedStone === i;
  }

  // Clicking previews an intersection; clicking the same one again places a stone.
  // On desktop the pointer hover previews, so a single click places.
  function previewOrPlace(i: number) {
    if (isPlaced(i)) {
      setPreviewedStone(null);
    } else if (isPreviewed(i)) {
      setStones((prev) => new Set(prev).add(i));
      setPreviewedStone(null);
    } else {
      setPreviewedStone(i);
    }
  }

  // Only a mouse hovers, so this previews on desktop without affecting touch taps.
  function handleIntersectionPointerEnter(event: PointerEvent, i: number) {
    if (event.pointerType !== 'mouse') return;

    setPreviewedStone(isPlaced(i) ? null : i);
  }

  function handleBoardPointerLeave(event: PointerEvent) {
    if (event.pointerType !== 'mouse') return;

    setPreviewedStone(null);
  }

  return (
    <div className={classes.root}>
      <div className={classes.board} onPointerLeave={handleBoardPointerLeave}>
        {Array.from({ length: intersections }, (_, i) => {
          const row = Math.floor(i / size);
          const col = i % size;

          const edgeTop = row === 0;
          const edgeRight = col === lastIndex;
          const edgeBottom = row === lastIndex;
          const edgeLeft = col === 0;

          const showStone = isPlaced(i) || isPreviewed(i);

          return (
            <div
              key={i}
              className={clsx(classes.intersection, {
                [classes.edgeTop]: edgeTop,
                [classes.edgeRight]: edgeRight,
                [classes.edgeBottom]: edgeBottom,
                [classes.edgeLeft]: edgeLeft,
              })}
              onPointerEnter={(event) => handleIntersectionPointerEnter(event, i)}
              onClick={() => previewOrPlace(i)}
            >
              {showStone && (
                <div className={clsx(classes.stone, { [classes.preview]: isPreviewed(i) })} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Board;
