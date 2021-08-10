import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { MAX_NUM_CHARS_SUPERPOWER_DESCRIPTION } from 'shared';

import BingoInput from 'components/bingoInput';
import DragHandle from 'components/dragHandle';
import TrashIcon from 'components/trashIcon';
import { DuxSuperpower } from 'reducers/bingoDux';

type Props = DuxSuperpower & {
  index: number;
  onChangeDescription: (description: string) => void;
  onDelete: () => void;
  className?: string;
};

const SuperpowerListItem: React.FC<Props> = ({
  description,
  uniqueId,
  onChangeDescription,
  onDelete,
  index,
}) => {
  const onClickDelete = () => {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm(
      `Are you sure you wish to delete superpower "${description}"?`
    );
    if (confirm) {
      onDelete();
    }
  };

  return (
    <Draggable draggableId={uniqueId} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="flex w-full mb-6 items-center"
        >
          <DragHandle
            {...provided.dragHandleProps}
            className="text-md mr-2 cursor-move"
          />
          <div className="flex-1" style={{ marginBottom: -16 }}>
            <BingoInput
              className="p-2 text-lg mb-1"
              placeholder="Enter a superpower"
              value={description}
              onChange={onChangeDescription}
            />
            <div className="flex justify-end text-xs">
              {description.length} / {MAX_NUM_CHARS_SUPERPOWER_DESCRIPTION}
            </div>
          </div>
          <TrashIcon
            onClick={onClickDelete}
            className="text-md ml-2 text-red cursor-pointer"
          />
        </div>
      )}
    </Draggable>
  );
};

export default SuperpowerListItem;
