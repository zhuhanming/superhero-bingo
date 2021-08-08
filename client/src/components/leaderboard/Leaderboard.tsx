import React from 'react';
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
  return (
    <div className={`flex flex-col ${className}`}>
      {superheroes.map((s) => (
        <div
          key={`leaderboard-superhero-${s.id}`}
          className="flex justify-between items-center bg-gray mb-2 p-2 rounded-lg border-black border-4"
        >
          <div className="font-medium text-lg">{s.name}</div>
          <div className="font-regular">
            {leaderboard[s.id] ?? 0} / {numSuperpowers}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
