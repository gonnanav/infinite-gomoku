import { type PointerEvent } from 'react';
import clsx from 'clsx';
import { type Coordinate, type IntersectionState, boardSize } from './board.ts';
import classes from './Intersection.module.css';

type IntersectionProps = {
  coordinate: Coordinate;
  state: IntersectionState;
  onPointerEnter: (event: PointerEvent, coordinate: Coordinate) => void;
  onClick: (coordinate: Coordinate) => void;
};

export function Intersection({ coordinate, state, onPointerEnter, onClick }: IntersectionProps) {
  const { row, col } = coordinate;
  const lastIndex = boardSize - 1;

  const edgeTop = row === 0;
  const edgeRight = col === lastIndex;
  const edgeBottom = row === lastIndex;
  const edgeLeft = col === 0;

  const showStone = state === 'black' || state === 'preview';
  const value = state === 'black' ? 'black' : 'empty';

  return (
    <div
      data-testid={`intersection-${row}-${col}`}
      className={clsx(classes.root, {
        [classes.edgeTop]: edgeTop,
        [classes.edgeRight]: edgeRight,
        [classes.edgeBottom]: edgeBottom,
        [classes.edgeLeft]: edgeLeft,
      })}
      onPointerEnter={(event) => onPointerEnter(event, coordinate)}
      onClick={() => onClick(coordinate)}
    >
      <span className="visually-hidden">{value}</span>
      {showStone && (
        <div aria-hidden className={clsx(classes.stone, { [classes.preview]: state === 'preview' })} />
      )}
    </div>
  );
}
