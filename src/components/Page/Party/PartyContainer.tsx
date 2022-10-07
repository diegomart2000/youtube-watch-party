import {
  useEffect,
  FC,
  useState,
  useCallback,
  useRef,
  useContext,
} from "react";
import { useRouter } from "next/router";
import { YouTubePlayer, YouTubeEvent } from "react-youtube";

import { PartyType, EPlayingStatus } from "common/types";
import { SessionContext } from "components/Session";

import db from "service/database";
import { Party } from "./Party";

export const PartyContainer: FC = () => {
  const router = useRouter();
  const user = useContext(SessionContext);

  const { partyId } = router.query;

  const pollRef = useRef<NodeJS.Timer>();
  const statuMutexRef = useRef<"PLAYER" | "UPDATE" | "RESET">();
  const [playerRef, setPlayerRef] = useState<YouTubePlayer>();
  const [status, setPartyStatus] = useState<PartyType["status"] | null>(null);
  const [videos, setPartyVideos] = useState<PartyType["videos"] | null>(null);

  console.log("handleOnEndVideo", "currentVideoId", status?.current);
  // To load the party once
  useEffect(() => {
    if (partyId) {
      console.log("loadPartyOnce", "should load", !status);
      if (status) return;

      (async () => {
        const data = await db.getParty(partyId?.toString());
        console.log("loadPartyOnce", "party data", data);
        // if (data?.event?.position) {
        //   playerRef?.seekTo(data?.event?.position);
        // }

        // This will cause the currentVideoId to be setted in state
        setPartyStatus({ ...data?.status, seekTo: data?.event?.position || 0 });
      })();
    }
  }, [partyId]);

  // useEffect(() => {
  //   console.log("currentVideoId", currentVideoId);
  //   playerRef?.loadVideoById(currentVideoId);
  // }, [currentVideoId, playerRef]);

  // Will subscribe to playback status changes
  useEffect(() => {
    if (partyId && playerRef) {
      console.log("registerling listener");
      // When the status is being updated from other originator
      return db.onPartyStatus(partyId?.toString(), (updatedStatus) => {
        console.log(
          "handleSetStatus",
          statuMutexRef.current,
          updatedStatus,
          playerRef
        );

        if (!updatedStatus) return;

        // If changes were triggered by the player, ignore these updates
        if (statuMutexRef.current === "PLAYER") {
          console.log(
            "handleSetStatus",
            "mutex",
            statuMutexRef.current,
            "allow mutext",
            "UPDATE"
          );

          // if updates from PLAYER, RESET to allow updates
          setTimeout(() => (statuMutexRef.current = "RESET"), 800);
          return;
        }

        statuMutexRef.current = "UPDATE";

        if (updatedStatus.originatorId !== user.userId) {
          // Make sure the one that generated the updated is not self
          console.log("handleSetStatus", "other user", "update");
          setPartyStatus(updatedStatus);

          if (updatedStatus.playing == EPlayingStatus.PLAYING) {
            console.log(
              "handleSetStatus",
              EPlayingStatus.PLAYING,
              "update video",
              playerRef.getVideoData(),
              playerRef.getVideoData()?.video_id !== updatedStatus.current
            );
            // Is video updated???
            if (playerRef.getVideoData()?.video_id !== updatedStatus.current) {
              playerRef.loadVideoById(updatedStatus.current);
            } else {
              playerRef.seekTo(updatedStatus.seekTo);
            }
            playerRef.playVideo();
          } else if (updatedStatus.playing == EPlayingStatus.PAUSED) {
            console.log(
              "handleSetStatus",
              EPlayingStatus.PAUSED,
              updatedStatus.seekTo
            );
            playerRef?.pauseVideo();
          }
        } else {
          console.log("handleSetStatus", "self user");
        }
      });
    }
  }, [partyId, playerRef]);

  // Will subscribe to video list changes
  useEffect(() => {
    if (partyId) {
      return db.onPartyVideos(partyId?.toString(), setPartyVideos);
    }
  }, [partyId]);

  // Is being called after video is set
  const handleReady = useCallback(
    (e) => {
      console.log("handleReady");
      const playerRef = e.target;
      setPlayerRef(playerRef);
      statuMutexRef.current = "RESET";

      // Check if actually play needs to happen
      if (status?.playing === EPlayingStatus.PLAYING) {
        playerRef.seekTo(status?.seekTo);
        playerRef.playVideo();
      }
    },
    [partyId, status]
  );

  const handlePlayerStateChange = async (e: YouTubeEvent) => {
    const playerRef = e.target;

    console.log(
      "handlePlayerStateChange",
      "mutex",
      statuMutexRef.current,
      "player state",
      playerRef.getPlayerState(),
      status?.playing
    );

    // If changes on player were triggered by updates, ignore
    if (statuMutexRef.current === "UPDATE") {
      console.log(
        "handlePlayerStateChange",
        statuMutexRef.current,
        "allow mutext",
        "PLAYER"
      );

      // If from UPDATES, RESET to allow player
      setTimeout(() => (statuMutexRef.current = "RESET"), 800);
      return;
    }

    statuMutexRef.current = "PLAYER";
    clearInterval(pollRef.current);

    if (partyId) {
      if (playerRef.getPlayerState() === EPlayingStatus.PLAYING) {
        // console.log("handlePlayerStateChange", "PLAYING --------");

        pollRef.current = setInterval(() => {
          console.log("position", playerRef.getCurrentTime());
          db.setCurrentPosition(
            partyId?.toString(),
            playerRef.getCurrentTime()
          );
        }, 1000);

        // Only update if status changed from previuos
        // if (status?.playing !== EPlayingStatus.PLAYING) {
        const newStatus: PartyType["status"] = {
          current: status?.current,
          playing: EPlayingStatus.PLAYING,
          seekTo: playerRef.getCurrentTime(),
          originatorId: user.userId,
        };

        // console.log("handlePlayerStateChange", "PLAYING", newStatus);
        await db.setPlayingStatus(partyId?.toString(), newStatus);
        // } else {
        //   console.log(
        //     "handlePlayerStateChange",
        //     "same player status",
        //     "PLAYING"
        //   );
        // }
        setPartyStatus(newStatus);
        return;
      }

      if (playerRef.getPlayerState() === EPlayingStatus.PAUSED) {
        const newStatus: PartyType["status"] = {
          current: status?.current,
          playing: EPlayingStatus.PAUSED,
          seekTo: playerRef.getCurrentTime(),
          originatorId: user.userId,
        };
        // console.log("handlePlayerStateChange", "PAUSED");
        await db.setPlayingStatus(partyId?.toString(), newStatus);
        setPartyStatus(newStatus);
        return;
      }

      if (playerRef.getPlayerState() === EPlayingStatus.ENDED) {
        if (!videos) {
          return;
        }
        const nextIndex = videos.indexOf(status?.current || "") + 1;
        const nextVideoId = videos[nextIndex];
        console.log(
          "handlePlayerStateChange",
          partyId?.toString(),
          "ENDED",
          status?.current,
          videos?.indexOf(status?.current || ""),
          videos,
          nextVideoId
        );

        if (!nextVideoId) {
          return;
        }

        playerRef.loadVideoById(nextVideoId);

        //
        const newStatus: PartyType["status"] = {
          playing: EPlayingStatus.PLAYING,
          current: nextVideoId,
          seekTo: 0,
          originatorId: "any",
        };

        // if (status?.originatorId !== user.userId){
        console.log("handlePlayerStateChange", "ENDED", "same originator");
        await db.setPlayingStatus(partyId?.toString() || "", newStatus);
        setPartyStatus(newStatus);
        // }
        // }, 400);
        setTimeout(async () => {
          // playerRef.playVideo();
        }, 100);
      }
    }
  };

  const handleOnEndVideo = async (e: YouTubeEvent) => {
    // if (!videos) {
    //   return;
    // }
    // const nextIndex = videos.indexOf(status?.current || "") + 1;
    // const nextVideoId = videos[nextIndex];
    // console.log(
    //   "handleOnEndVideo",
    //   partyId?.toString(),
    //   "ENDED",
    //   status?.current,
    //   videos?.indexOf(status?.current || ""),
    //   videos,
    //   nextVideoId
    // );
    // // if (!status?.current) {
    // //   console.log(
    // //     "handleOnEndVideo",
    // //     "no current",
    // //     status?.current,
    // //     "do nothing"
    // //   );
    // //   return;
    // // }
    // // const currentVideoId = status?.current
    // //   ? videos?.[videos?.indexOf(status?.current) + 1]
    // //   : videos?.[1];
    // playerRef.loadVideoById(nextVideoId);
    // const newStatus: PartyType["status"] = {
    //   playing: EPlayingStatus.PLAYING,
    //   current: nextVideoId,
    //   seekTo: 0,
    //   originatorId: "any",
    // };
    // // console.log("handleOnEndVideo", "update", newStatus);
    // statuMutexRef.current = "RESET"; // Reset mutex to allow player update
    // await db.setPlayingStatus(partyId?.toString() || "", newStatus);
  };

  return (
    <Party
      partyId={partyId?.toString() ?? null}
      user={user}
      videos={videos}
      currentVideoId={status?.current || ""}
      onReady={handleReady}
      onPlayerStateChange={handlePlayerStateChange}
      onEndVideo={handleOnEndVideo}
    />
  );
};
