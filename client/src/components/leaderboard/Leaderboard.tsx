import React from 'react';
import { animated, useTransition } from '@react-spring/web';
import { Leaderboard as LeaderboardType, Superhero } from 'shared';

type Props = {
  superheroes: Superhero[];
  leaderboard: LeaderboardType;
  numSuperpowers: number;
  className?: string;
};

const Leaderboard: React.FC<Props> = ({
  superheroes,
  leaderboard,
  numSuperpowers,
  className = '',
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
            item.score === numSuperpowers ? 'bg-green' : 'bg-gray'
          } mb-2 p-4 rounded-lg border-black border-4`}
          style={{ zIndex: superheroes.length - index, ...style }}
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
