import React from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { validateBingo } from 'shared';

import Navbar from 'components/navbar';
import SuperpowerGrid from 'components/superpowerGrid';
import SuperpowerListItem from 'components/superpowerListItem';
import { MAX_DESCRIPTION_LENGTH } from 'constants/bingo';
import { useSocket } from 'contexts/SocketContext';
import {
  addBingoSuperpower,
  deleteBingoSuperpower,
  updateBingoName,
  updateBingoSuperpower,
  updateBingoSuperpowers,
} from 'reducers/bingoDux';
import { RootState } from 'reducers/rootReducer';
import { createBingo, updateBingo } from 'services/socketRequestService';
import { sortByOrder } from 'utils/sortUtils';

const Edit: React.FC = () => {
  const { bingo } = useSelector((state: RootState) => state.bingo);
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const superpowers = bingo.superpowers.slice().sort(sortByOrder);

  const onClickAdd = () => {
    dispatch(addBingoSuperpower());
  };

  const onClickSave = () => {
    if (bingo.ownerCode.length === 6) {
      updateBingo(socket, bingo);
    } else {
      createBingo(socket, bingo);
    }
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

  const onSuperpowerChange = (index: number, description: string): void => {
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      return;
    }
    dispatch(updateBingoSuperpower({ index, description }));
  };

  const onSuperpowerDelete = (index: number): void => {
    dispatch(deleteBingoSuperpower(index));
  };

  const isValidBingo = (): boolean => {
    try {
      validateBingo(bingo);
      return true;
    } catch (_) {
      return false;
    }
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
          <input
            className="w-full rounded-xl p-2 text-lg font-medium mb-4"
            placeholder="Name of Your Collection"
            value={bingo.name}
            onChange={(event) => dispatch(updateBingoName(event.target.value))}
          />
          <h2 className="font-bold text-lg">Owner Code</h2>
          <input
            className="w-full rounded-xl p-2 text-lg font-medium mb-4"
            placeholder="You need to save first!"
            value={bingo.ownerCode}
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
                        onSuperpowerChange(index, description)
                      }
                      onDelete={() => onSuperpowerDelete(index)}
                    />
                  ))}
                  <Draggable
                    draggableId="add-button"
                    index={superpowers.length}
                    isDragDisabled
                  >
                    {(provided) => (
                      <button
                        type="button"
                        className="w-full font-bold text-lg p-2 bg-white rounded-xl border-black border-4 shadow-lg"
                        onClick={onClickAdd}
                        disabled={superpowers.length >= 25}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        Add New Superpower
                      </button>
                    )}
                  </Draggable>
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <button
            type="button"
            className="w-full font-bold text-lg p-2 bg-blue rounded-xl border-black border-4 shadow-lg mt-4 transform transition duration-500 hover:scale-105"
            onClick={onClickSave}
            disabled={!isValidBingo()}
          >
            Save Changes
          </button>
          <button
            type="button"
            className="w-full font-bold text-lg p-2 bg-green rounded-xl border-black border-4 shadow-lg mt-4 transform transition duration-500 hover:scale-105"
            onClick={onClickSave}
            disabled={!isValidBingo()}
          >
            Start Game
          </button>
        </div>
        <div className="hidden md:block" style={{ flex: 3 }}>
          <SuperpowerGrid superpowers={superpowers} />
        </div>
      </main>
    </>
  );
};

export default Edit;
