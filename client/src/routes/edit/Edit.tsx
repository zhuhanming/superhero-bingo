import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import autosize from 'autosize';
import { validateBingo } from 'shared';
import { v4 as uuidv4 } from 'uuid';

import BingoButton from 'components/bingoButton';
import BingoInput from 'components/bingoInput';
import Navbar from 'components/navbar';
import SuperpowerGrid from 'components/superpowerGrid';
import SuperpowerListItem from 'components/superpowerListItem';
import { MAX_DESCRIPTION_LENGTH } from 'constants/bingo';
import { GAME } from 'constants/routes';
import { useSocket } from 'contexts/SocketContext';
import {
  addBingoSuperpower,
  deleteBingoSuperpower,
  updateBingoName,
  updateBingoSuperpower,
  updateBingoSuperpowers,
} from 'reducers/bingoDux';
import { clearGame } from 'reducers/gameDux';
import { updateLoadingState } from 'reducers/miscDux';
import { RootState } from 'reducers/rootReducer';
import { createBingo, updateBingo } from 'services/bingoService';
import { createGame } from 'services/gameService';
import { sortByOrder } from 'utils/sortUtils';

const Edit: React.FC = () => {
  const { bingo } = useSelector((state: RootState) => state.bingo);
  const lastFetched = useSelector((state: RootState) => state.game.lastFetched);
  const [previousLastFetch, setPreviousLastFetched] = useState(lastFetched);
  const { isSaving, isStartingGame } = useSelector(
    (state: RootState) => state.misc.loading
  );
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const history = useHistory();
  const superpowers = bingo.superpowers.slice().sort(sortByOrder);

  useEffect(() => {
    if (lastFetched !== previousLastFetch) {
      history.push(GAME);
      setPreviousLastFetched(lastFetched);
    }
  }, [lastFetched]);

  const onClickAdd = () => {
    dispatch(addBingoSuperpower());
  };

  const onClickSave = () => {
    try {
      validateBingo(bingo);
    } catch (error) {
      toast(error.message, { type: 'error' });
      return;
    }
    dispatch(updateLoadingState({ isSaving: true }));
    if (bingo.ownerCode.length === 6) {
      updateBingo(socket, bingo);
    } else {
      createBingo(socket, bingo);
    }
  };

  const onClickStart = () => {
    try {
      validateBingo(bingo);
    } catch (error) {
      toast(error.message, { type: 'error' });
      return;
    }
    dispatch(updateLoadingState({ isStartingGame: true }));
    dispatch(clearGame());
    updateBingo(socket, bingo);
    createGame(socket, bingo.ownerCode);
  };

  const onDragEnd = (dropResult: DropResult) => {
    const { source, destination } = dropResult;
    if (destination == null) {
      return;
    }
    const droppedSuperpower = superpowers[source.index];
    const superpowersCopy = superpowers.slice();
    superpowersCopy.splice(source.index, 1);
    superpowersCopy.splice(destination.index, 0, droppedSuperpower);
    for (let i = 0; i < superpowersCopy.length; i += 1) {
      superpowersCopy[i] = { ...superpowersCopy[i], order: i };
    }
    dispatch(updateBingoSuperpowers(superpowersCopy));
  };

  const onSuperpowerChange = (
    index: number,
    description: string,
    changeUniqueId = false
  ): void => {
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      return;
    }
    const updateObject: {
      index: number;
      description: string;
      uniqueId?: string | undefined;
    } = { index, description };
    if (changeUniqueId) {
      updateObject.uniqueId = uuidv4();
    }
    dispatch(updateBingoSuperpower(updateObject));
    autosize(document.querySelectorAll('textarea'));
  };

  const onSuperpowerDelete = (index: number): void => {
    dispatch(deleteBingoSuperpower(index));
  };

  return (
    <>
      <Navbar />
      <main className="flex mt-8" style={{ height: 'calc(100vh - 8rem)' }}>
        <div className="flex flex-col" style={{ flex: 2 }}>
          <h1 className="font-bold text-2xl mb-4">
            Make Your Superpower Collection!
          </h1>
          <h2 className="font-bold text-lg">Name of Collection</h2>
          <BingoInput
            className="p-2 text-lg mb-4"
            placeholder="Name of Your Collection"
            value={bingo.name}
            onChange={(value) => dispatch(updateBingoName(value))}
          />
          <h2 className="font-bold text-lg">Owner Code</h2>
          <BingoInput
            className="p-2 text-lg mb-4"
            placeholder="Save this collection to get a code"
            value={bingo.ownerCode}
            onChange={() => undefined}
            isDisabled
          />
          <h2 className="font-bold text-lg mb-2">Superpowers</h2>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="superpowers" type="superpowers">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex w-full flex-col flex-1 overflow-scroll"
                >
                  {superpowers.map((superpower, index) => (
                    <SuperpowerListItem
                      key={`superpower-list-item-${superpower.order}`}
                      {...superpower}
                      index={index}
                      onChangeDescription={(description) =>
                        onSuperpowerChange(index, description, true)
                      }
                      onDelete={() => onSuperpowerDelete(index)}
                    />
                  ))}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <BingoButton
            text="Add New Superpower"
            onClick={onClickAdd}
            isDisabled={superpowers.length >= 25 || isSaving || isStartingGame}
            className="text-lg p-2 bg-white border-black border-4 mt-2"
            hasHover={false}
          />
          <BingoButton
            text="Save Changes"
            className="text-lg p-2 bg-blue border-black border-4 mt-2"
            onClick={onClickSave}
            isDisabled={isStartingGame}
            isLoading={isSaving}
          />
          <BingoButton
            text="Start Game"
            className="text-lg p-2 bg-green border-black border-4 mt-2"
            onClick={onClickStart}
            isDisabled={bingo.id < 0 || isSaving}
            isLoading={isStartingGame}
          />
        </div>
        <div className="hidden md:block" style={{ flex: 3 }}>
          <SuperpowerGrid
            superpowers={superpowers}
            onChangeGridCell={onSuperpowerChange}
          />
        </div>
      </main>
    </>
  );
};

export default Edit;
