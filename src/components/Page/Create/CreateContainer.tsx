import { SessionContext } from "components/Session";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import { FC, useContext, useRef } from "react";
import { Create } from "./Create";
import db from "service/database";
import { useRouter } from "next/router";

export const CreateContainer: FC = () => {
  const router = useRouter();
  const user = useContext(SessionContext);
  const [partyId, setPartyId] = useState("");
  const [videoId, setVideoId] = useState("");
  useEffect(() => {
    setPartyId(
      crypto.getRandomValues(new Uint16Array(1)).toString().padStart(5, "0")
    );
  }, []);

  const handleCreateParty = useCallback(async () => {
    if (videoId) {
      await db.createParty({partyId, videoId});
      router.push(`/party/${partyId}`);
    }
  }, [partyId, videoId]);

  return (
    <Create
      partyId={partyId}
      user={user}
      onChangeName={user.onChangeName}
      onAddVideo={setVideoId}
      onCreateParty={handleCreateParty}
    />
  );
};
