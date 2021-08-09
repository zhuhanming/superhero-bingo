export type Invite = {
  superpowerId: number;
  superpowerDescription: string;
  inviteCode: string;
  ownerId: number;
  ownerName: string;
  signeeId?: number;
  signeeName?: string;
};
