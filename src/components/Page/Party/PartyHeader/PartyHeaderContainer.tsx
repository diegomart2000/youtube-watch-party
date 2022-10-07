import { PartyType } from "common/types";
import { FC, useEffect, useState } from "react";
import { PartyHeader } from "./PartyHeader";
import db from "service/database";

export const PartyHeaderContainer: FC<{ partyId: string }> = ({ partyId }) => {
  const [videos, setPartyVideos] = useState<PartyType["videos"] | null>(null);

  // Will subscribe to video list changes
  useEffect(() => {
    if (partyId) {
      return db.onPartyVideos(partyId?.toString(), setPartyVideos);
    }
  }, [partyId]);

  const handleAddVideo = (videoId: string) => {
    const existing = videos?.find((id) => id === videoId);
    if(!existing) {
      db.setPartyVideos(partyId, [...(videos ?? []), videoId]);
    }
  };

  return <PartyHeader partyId={partyId} onAddVideo={handleAddVideo} />;
}