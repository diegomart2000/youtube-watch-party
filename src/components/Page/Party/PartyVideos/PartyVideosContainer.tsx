import { PartyType } from "common/types";
import { FC, useEffect, useState } from "react";
import { PartyVideos } from "./PartyVideos";
import db from "service/database";

export const PartyVideosContainer: FC<{ partyId: string }> = ({ partyId }) => {
  const [videos, setPartyVideos] = useState<PartyType["videos"] | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  // Will subscribe to video list changes
  useEffect(() => {
    if (partyId) {
      return db.onPartyVideos(partyId?.toString(), setPartyVideos);
    }
  }, [partyId]);

  // Will subscribe to playback status changes
  useEffect(() => {
    if (partyId) {
      return db.onPartyStatus(partyId?.toString(), (status) => {
        console.log("PartyVideosContainer", status);
        if (!status) return;
        setCurrentVideoId(status.current || '');
      });
    }
  }, [partyId, videos]);

  const handleUpdateVideos = (videos: string[]) => {
    db.setPartyVideos(partyId, videos);
  };

  const handleRemoveVideo = (videoId: string) => {
    const videosFiltered = videos?.filter((id) => id !== videoId);
    if (videosFiltered){
      db.setPartyVideos(partyId, videosFiltered);
    } 
  };

  return (
    <PartyVideos
      videos={videos}
      currentVideoId={currentVideoId}
      onSortVideos={handleUpdateVideos}
      onRemoveVideo={handleRemoveVideo}
    />
  );
};
