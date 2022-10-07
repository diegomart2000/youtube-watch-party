import styles from "./VideoInput.module.css";
import classNames from "classnames/bind";
import { FC, SyntheticEvent, useState } from "react";
import { getVideoId } from "common/utils";
import { IconButton } from "components/Icon/IconButton";
import { IconYoutube } from "components/Icon/IconYoutube";
const cx = classNames.bind(styles);

interface IVideoInputProps {
  noIcon?: boolean;
  onChange: (videoId: string) => void;
  onClick: () => void;
}

export const VideoInput: FC<IVideoInputProps> = ({noIcon = false, onChange, onClick }) => {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const handleChange = ({
    currentTarget: { value },
  }: SyntheticEvent<HTMLInputElement>) => {
    try {
      const videoId = getVideoId(value);
      setUrl(value);
      setVideoId(videoId);
      onChange(videoId);
    } catch (e) {
      setUrl("");
      setVideoId("");
      onChange("");
    }
  };

  return (
    <div className={cx("video")}>
      {!noIcon && (
        <div className={cx("video__youtube")}>
          <IconYoutube />
        </div>
      )}
      <div className={cx("video__input")}>
        <input
          value={url}
          onChange={handleChange}
          placeholder="Paste youtube video url"
        />
        <p>{videoId}</p>
      </div>

      <div className={cx("video_thumbnail")}>
        {videoId ? (
          <img src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} />
        ) : (
          <span>🤔</span>
        )}
      </div>
      <button onClick={onClick}>
        <IconButton />
      </button>
    </div>
  );
};
