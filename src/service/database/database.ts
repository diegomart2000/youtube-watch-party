import { EPlayingStatus, PartyType } from "common/types";
import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, onValue, get } from "firebase/database";

const firebaseConfig = {
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

const db = {
  createUser: async (userId: string, name: string) => {
    await set(ref(database, `users/${userId}`), {
      username: name,
    });
  },

  createParty: async (props: { partyId?: string; videoId: string }) => {
    const partyId =
      props.partyId ||
      crypto.getRandomValues(new Uint16Array(1)).toString().padStart(5, "0");

    const party: PartyType = {
      videos: [props.videoId],
      status: {
        current: props.videoId,
        playing: EPlayingStatus.ENDED,
        seekTo: 0,
      },
      event: {
        position: 0,
      },
    };

    await set(ref(database, `parties/${partyId}`), party);

    return party;
  },

  getParty: async (partyId: string): Promise<PartyType | null> => {
    const resp = ref(database, `/parties/${partyId}`);
    const snap = await get(resp);
    if (snap.exists()) {
      return snap.val();
    }

    return null;
  },

  subscribeToPath: <T>(
    partyId: string,
    path: keyof PartyType,
    cb: (partyState: T) => void
  ): (() => void) => {
    const resp = ref(database, `/parties/${partyId}/${path}`);

    const unsubscribeCb = onValue(resp, (snap) => {
      if (snap.exists()) {
        cb(snap.val());
      }
    });

    return unsubscribeCb;
  },

  onPartyStatus: (
    partyId: string,
    cb: (partyState: PartyType["status"] | null) => void
  ): (() => void) => {
    return db.subscribeToPath(partyId, "status", cb);
  },

  onPartyVideos: (
    partyId: string,
    cb: (partyState: PartyType["videos"] | null) => void
  ): (() => void) => {
    return db.subscribeToPath(partyId, "videos", cb);
  },

  setCurrentPosition: async (partyId: string, position = 0) => {
    await set(ref(database, `parties/${partyId}/event/position`), position);
  },

  setPlayingStatus: async (partyId: string, status: PartyType["status"]) => {
    await set(ref(database, `parties/${partyId}/status`), status);
  },

  setPartyVideos: async (partyId: string, videos: PartyType["videos"]) => {
    await set(ref(database, `parties/${partyId}/videos`), videos);
  },
};

export default db;
