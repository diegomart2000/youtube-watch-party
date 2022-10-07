export type UserType = {
  userId?: string;
  name?: string;
}

export enum EPlayingStatus {
  ENDED,
  PLAYING,
  PAUSED,
}

export type PartyType = {
  videos: string[];
  status: {
    current?: string;
    playing?: EPlayingStatus;
    seekTo?: number;
    originatorId?: string;
  };
  event: {
    position?: number;
  };
}
