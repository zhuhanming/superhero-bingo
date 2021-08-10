import {
  Invite,
  NOTIF_OWNER_JOIN_GAME,
  NOTIF_OWNER_LEAVE_GAME,
  NOTIF_OWNER_SIGN_INVITE,
  Superhero,
} from 'shared';
import { Socket } from 'socket.io-client';

import store from 'app/store';
import {
  addSuperheroIdAndInvites,
  removeSuperheroId,
  signInvitation,
} from 'reducers/ownerDux';

const onNotifOwnerJoinGame = (socket: Socket): void => {
  socket.on(
    NOTIF_OWNER_JOIN_GAME,
    (payload: { user: Superhero; invites: Invite[] }) => {
      store.dispatch(
        addSuperheroIdAndInvites({
          superheroId: payload.user.id,
          invites: payload.invites,
        })
      );
    }
  );
};

const onNotifOwnerLeaveGame = (socket: Socket): void => {
  socket.on(NOTIF_OWNER_LEAVE_GAME, (payload: number) => {
    store.dispatch(removeSuperheroId(payload));
  });
};

const onNotifOwnerSignInvite = (socket: Socket): void => {
  socket.on(
    NOTIF_OWNER_SIGN_INVITE,
    (payload: { ownerId: number; inviteId: number; signee: Superhero }) => {
      store.dispatch(signInvitation(payload));
    }
  );
};

export const initializeSocketForOwner = (socket: Socket): void => {
  onNotifOwnerJoinGame(socket);
  onNotifOwnerLeaveGame(socket);
  onNotifOwnerSignInvite(socket);
};
