import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Invite, MAX_NUM_CHARS_SUPERPOWER_DESCRIPTION } from 'shared';

import BingoInput from 'components/bingoInput';
import DragHandle from 'components/dragHandle';
import TrashIcon from 'components/trashIcon';
import { DuxSuperpower } from 'reducers/bingoDux';
import { emptyFunction } from 'utils/callbackHandler';

type Props = DuxSuperpower & {
  isEdit: boolean;
  index?: number;
  onChangeDescription?: (description: string) => void;
  onDelete?: () => void;
  className?: string;
  invites?: Invite[];
};

const SuperpowerListItem: React.FC<Props> = ({
  id,
  isEdit,
  description,
  uniqueId,
  onChangeDescription = emptyFunction,
  onDelete = emptyFunction,
  index = 0,
  invites = [],
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

  if (!isEdit) {
    const invite = invites.find((i) => i.superpowerId === id);
    return (
      <div
        className={`flex flex-col ${
          invite?.signeeId == null ? 'bg-gray' : 'bg-green'
        } mb-2 p-4 rounded-lg border-black border-4`}
      >
        <div className="font-regular text-sm">
          {invite?.signeeId == null
            ? invite?.inviteCode
            : `Signed by: ${invite?.signeeName}`}
        </div>
        <div className="font-medium text-xl">{description}</div>
      </div>
    );
  }

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
