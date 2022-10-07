import { FC, useState } from "react";
import Code from "components/Code";
import { IconPlus } from "components/Icon/IconPlus";
import { IconYoutube } from "components/Icon/IconYoutube";

import classNames from "classnames/bind";
import styles from "./PartyHeader.module.css";
import VideoInput from "components/VideoInput";
const cx = classNames.bind(styles);

interface IPartyHeaderProps {
  partyId: string;
  onAddVideo: (videoId:string) => void;
}
export const PartyHeader: FC<IPartyHeaderProps> = ({ partyId, onAddVideo }) => {
  const [display, setDisplay] = useState(false);
  const [videoId, setVideoId] = useState("");
  const handleClick = () => {
    setDisplay(false);
    if (videoId) {
      onAddVideo(videoId);
    }
  }

  return (
    <div className={cx("party__header")}>
      <div className={cx("header__code")}>
        <div className={cx("header__youtube")}>
          <IconYoutube />
        </div>
        <div className={cx("header__title")}>
          <Code partyId={partyId ?? ""} />
        </div>
      </div>

      <div className={cx("header__add")}>
        <IconPlus onClick={() => setDisplay(true)} />
        {display && (
          <div className={cx("header__input")}>
            <VideoInput
              noIcon={true}
              onChange={setVideoId}
              onClick={handleClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};
