import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { animated, useTransition } from '@react-spring/web';
import { SuperheroResult } from 'shared';

import BingoButton from 'components/bingoButton';
import Navbar from 'components/navbar';
import { ROOT } from 'constants/routes';
import { clearBingo } from 'reducers/bingoDux';
import { clearGameDux } from 'reducers/gameDux';
import { RootState } from 'reducers/rootReducer';
import {
  sortByBingoCompletion,
  sortByNumPowersSigned,
  sortByNumUniquePowersSigned,
} from 'utils/sortUtils';
import { msToTime } from 'utils/timeUtils';

const transitionHelper = {
  key: (result: SuperheroResult) => result.superhero.id,
  from: { height: 0, opacity: 0 },
  leave: { height: 0, opacity: 0 },
  enter: ({ y }: { y: number }) => ({ y, height: 68, opacity: 1 }),
  update: ({ y }: { y: number }) => ({ y, height: 68 }),
};

const CompletedGame: React.FC = () => {
  const results = useSelector((state: RootState) => state.game.results);
  const history = useHistory();
  const dispatch = useDispatch();

  const numPowersSignedResults = results
    .slice()
    .sort(sortByNumPowersSigned)
    .slice(0, 3);

  const bingoCompletionResults = results
    .slice()
    .sort(sortByBingoCompletion)
    .slice(0, 3);

  const numUniquePowersSignedResults = results
    .slice()
    .sort(sortByNumUniquePowersSigned)
    .slice(0, 3);

  const numPowersSignedTransitions = useTransition(
    numPowersSignedResults.map((r) => ({ ...r, y: 0 })),
    transitionHelper
  );

  const bingoCompletionTransitions = useTransition(
    bingoCompletionResults.map((r) => ({ ...r, y: 0 })),
    transitionHelper
  );

  const numUniquePowersSignedTransitions = useTransition(
    numUniquePowersSignedResults.map((r) => ({ ...r, y: 0 })),
    transitionHelper
  );

  const onClickBackToHome = () => {
    dispatch(clearBingo());
    dispatch(clearGameDux());
    history.push(ROOT);
  };

  return (
    <>
      <Navbar />
      <main
        style={{ minHeight: 'calc(100vh - 6rem)' }}
        className="w-full flex flex-col justify-center items-center text-center"
      >
        <h1 className="font-bold text-3xl mb-12">Final Results</h1>
        <div className="w-full flex flex-col lg:flex-row justify-between lg:items-end">
          <div className="flex-1 lg:p-4 mt-2">
            <h2 className="font-bold text-2xl mb-4 text-red">
              No. of Powers Signed
            </h2>
            {numPowersSignedTransitions((style, item, t, index) => (
              <animated.div
                className="flex justify-between items-center bg-gray mb-2 p-4 rounded-lg border-black border-4"
                style={{
                  zIndex: numPowersSignedResults.length - index,
                  ...style,
                }}
              >
                <div className="font-medium text-xl">{item.superhero.name}</div>
                <div className="font-regular">
                  {item.numPowersInOthersBingoSigned}
                </div>
              </animated.div>
            ))}
          </div>
          <div className="flex-1 lg:p-4 mt-2">
            <h2 className="font-bold text-2xl mb-4 text-red">
              Most Superheroes Found
            </h2>
            {bingoCompletionTransitions((style, item, t, index) => (
              <animated.div
                className="flex justify-between items-center bg-gray mb-2 p-4 rounded-lg border-black border-4"
                style={{
                  zIndex: numPowersSignedResults.length - index,
                  ...style,
                }}
              >
                <div className="font-medium text-xl">{item.superhero.name}</div>
                <div className="flex flex-col justify-center items-end">
                  <div className="font-regular">
                    {item.numPowersInOwnBingoSigned}
                  </div>
                  <div className="font-regular">
                    {item.timeTakenToGetLastPowerSigned != null
                      ? msToTime(item.timeTakenToGetLastPowerSigned)
                      : 'N/A'}
                  </div>
                </div>
              </animated.div>
            ))}
          </div>
          <div className="flex-1 lg:p-4 mt-2">
            <h2 className="font-bold text-2xl mb-4 text-red">
              No. of Unique Powers Signed
            </h2>
            {numUniquePowersSignedTransitions((style, item, t, index) => (
              <animated.div
                className="flex justify-between items-center bg-gray mb-2 p-4 rounded-lg border-black border-4"
                style={{
                  zIndex: numPowersSignedResults.length - index,
                  ...style,
                }}
              >
                <div className="font-medium text-xl">{item.superhero.name}</div>
                <div className="font-regular">
                  {item.numDifferentPowersInOthersBingoSigned}
                </div>
              </animated.div>
            ))}
          </div>
        </div>
        <BingoButton
          text="Back to Home Page"
          onClick={onClickBackToHome}
          className="text-lg lg:max-w-2xl p-2 bg-red border-black border-4 mt-8"
        />
      </main>
    </>
  );
};

export default CompletedGame;
