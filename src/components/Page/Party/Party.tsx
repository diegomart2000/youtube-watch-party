import { FC } from "react";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";
import { UserType } from "common/types";
import classNames from "classnames/bind";
import styles from "./Party.module.css";
import PartyHeader from "./PartyHeader";
import PartyVideos from "./PartyVideos";
const cx = classNames.bind(styles);

const opts: YouTubeProps["opts"] = {
  height: "470",
  width: "940",
  playerVars: {
    modestbranding: 1,
  },
};

interface IPartyProps {
  partyId: string | null;
  user: UserType;
  videos: string[] | null;
  currentVideoId: string | null;
  onReady: (e: YouTubeEvent<number>) => void;
  onPlayerStateChange: (e: YouTubeEvent<number>) => void;
  onEndVideo: (e: YouTubeEvent<number>) => void;
}

export const Party: FC<IPartyProps> = ({
  partyId,
  user,
  videos,
  currentVideoId,
  onReady,
  onPlayerStateChange,
  onEndVideo,
}) => {
  return (
    <div className={cx("party")}>
      {currentVideoId && (
        <>
          <div className={cx("party__player")}>
            <PartyHeader partyId={partyId ?? ""} />

            {user && <div>{user.name}</div>}

            <YouTube
              videoId={currentVideoId}
              opts={opts}
              onReady={onReady}
              onStateChange={onPlayerStateChange}
              onEnd={onEndVideo}
            />
          </div>
          <PartyVideos partyId={partyId ?? ""} />
        </>
      )}
    </div>
  );
};
