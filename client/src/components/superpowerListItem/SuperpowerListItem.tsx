import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import DragHandle from 'components/dragHandle';
import TrashIcon from 'components/trashIcon';
import { MAX_DESCRIPTION_LENGTH } from 'constants/bingo';
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
            <input
              className="w-full rounded-xl p-2 text-lg font-medium mb-1"
              placeholder="Enter a superpower"
              value={description}
              onChange={(event) => onChangeDescription(event.target.value)}
            />
            <div className="flex justify-end text-xs">
              {description.length} / {MAX_DESCRIPTION_LENGTH}
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
