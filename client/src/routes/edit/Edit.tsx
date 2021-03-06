import React, { useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import autosize from 'autosize';
import {
  MAX_NUM_CHARS_SUPERPOWER_DESCRIPTION,
  NUM_CHARS_OWNER_CODE,
  validateBingo,
} from 'shared';
import { v4 as uuidv4 } from 'uuid';

import BingoButton from 'components/bingoButton';
import BingoInput from 'components/bingoInput';
import SuperpowerGrid from 'components/superpowerGrid';
import SuperpowerListItem from 'components/superpowerListItem';
import { GAME } from 'constants/routes';
import { useSocket } from 'contexts/SocketContext';
import {
  addBingoSuperpower,
  deleteBingoSuperpower,
  updateBingoName,
  updateBingoSuperpower,
  updateBingoSuperpowers,
} from 'reducers/bingoDux';
import { clearGameDux } from 'reducers/gameDux';
import { updateLoadingState } from 'reducers/miscDux';
import { RootState } from 'reducers/rootReducer';
import { createBingo, updateBingo } from 'services/bingoService';
import { createGame } from 'services/gameService';
import { callbackHandler } from 'utils/callbackHandler';
import { sortByOrder } from 'utils/sortUtils';

const Edit: React.FC = () => {
  const { bingo } = useSelector((state: RootState) => state.bingo);
  const { isSaving, isCreatingRoom } = useSelector(
    (state: RootState) => state.misc.loading
  );
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const superpowers = bingo.superpowers.slice().sort(sortByOrder);

  useEffect(() => {
    dispatch(updateLoadingState({ isSaving: false, isCreatingRoom: false }));
  }, []);

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
    if (bingo.ownerCode.length === NUM_CHARS_OWNER_CODE) {
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
    callbackHandler.createGameCallback = () => window.open(GAME);
    dispatch(updateLoadingState({ isCreatingRoom: true }));
    dispatch(clearGameDux());
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
    if (description.length > MAX_NUM_CHARS_SUPERPOWER_DESCRIPTION) {
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
    <main className="flex pt-8" style={{ height: 'calc(100vh - 3rem)' }}>
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
                className="flex w-full flex-col flex-1 overflow-scroll hide-scrollbar"
              >
                {superpowers.map((superpower, index) => (
                  <SuperpowerListItem
                    isEdit
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
          isDisabled={superpowers.length >= 25 || isSaving || isCreatingRoom}
          className="text-lg p-2 bg-white border-black border-4 mt-2"
          hasHover={false}
        />
        <BingoButton
          text="Save Changes"
          className="text-lg p-2 bg-blue border-black border-4 mt-2"
          onClick={onClickSave}
          isDisabled={isCreatingRoom}
          isLoading={isSaving}
        />
        <BingoButton
          text="Create Room"
          className="text-lg p-2 bg-green border-black border-4 mt-2"
          onClick={onClickStart}
          isDisabled={bingo.id < 0 || isSaving}
          isLoading={isCreatingRoom}
        />
      </div>
      <div className="hidden md:block" style={{ flex: 3 }}>
        <SuperpowerGrid
          superpowers={superpowers}
          onChangeGridCell={onSuperpowerChange}
          className="pl-20"
        />
      </div>
    </main>
  );
};

export default Edit;
