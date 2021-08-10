import React from 'react';
import { animated, useTransition } from '@react-spring/web';
import { Leaderboard as LeaderboardType, Superhero } from 'shared';

type Props = {
  superheroes: Superhero[];
  leaderboard: LeaderboardType;
  numSuperpowers: number;
  className?: string;
  onClick?: (id: number) => void;
  selectedId?: number;
};

const Leaderboard: React.FC<Props> = ({
  superheroes,
  leaderboard,
  numSuperpowers,
  className = '',
  onClick,
  selectedId,
}) => {
  const superheroesWithScore = superheroes
    .map((s) => ({ ...s, score: leaderboard[s.id] ?? 0 }))
    .sort((a, b) => b.score - a.score);

  const transitions = useTransition(
    superheroesWithScore.map((s) => ({ ...s, y: 0 })),
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
          className={`flex justify-between items-center ${
            // eslint-disable-next-line no-nested-ternary
            selectedId === item.id
              ? 'bg-blue'
              : item.score === numSuperpowers
              ? 'bg-green'
              : 'bg-gray'
          } mb-2 p-4 rounded-lg border-black border-4 ${
            onClick != null ? 'cursor-pointer' : ''
          }`}
          style={{ zIndex: superheroes.length - index, ...style }}
          onClick={onClick != null ? () => onClick(item.id) : undefined}
        >
          <div className="font-medium text-xl">{item.name}</div>
          <div className="font-regular">
            {item.score} / {numSuperpowers}
          </div>
        </animated.div>
      ))}
    </div>
  );
};

export default Leaderboard;
