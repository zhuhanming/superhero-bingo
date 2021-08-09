import React from 'react';
import { animated, useTransition } from '@react-spring/web';
import { Superhero } from 'shared';

type Props = {
  superheroes: Superhero[];
  leaderboard: { [heroId: number]: number };
  numSuperpowers: number;
  className?: string;
};

const Leaderboard: React.FC<Props> = ({
  superheroes,
  leaderboard,
  numSuperpowers,
  className = '',
}) => {
  const transitions = useTransition(
    superheroes
      .slice()
      .sort((a, b) => (leaderboard[b.id] ?? 0) - (leaderboard[a.id] ?? 0))
      .map((s) => ({ ...s, y: 0 })),
    {
      key: (superhero: Superhero) => superhero.id,
      from: { height: 0, opacity: 0 },
      leave: { height: 0, opacity: 0 },
      enter: ({ y }) => ({ y, height: 68, opacity: 1 }),
      update: ({ y }) => ({ y, height: 68 }),
    }
  );

  return (
    <div className={`flex flex-col ${className}`}>
      {transitions((style, item, t, index) => (
        <animated.div
          className="flex justify-between items-center bg-gray mb-2 p-4 rounded-lg border-black border-4"
          style={{ zIndex: superheroes.length - index, ...style }}
        >
          <div className="font-medium text-xl">{item.name}</div>
          <div className="font-regular">
            {leaderboard[item.id] ?? 0} / {numSuperpowers}
          </div>
        </animated.div>
      ))}
    </div>
  );
};

export default Leaderboard;
