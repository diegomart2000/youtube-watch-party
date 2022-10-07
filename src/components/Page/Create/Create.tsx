import { FC } from "react";
import classNames from "classnames/bind";
import styles from "./Create.module.css";
import { UserType } from "common/types";
import VideoInput from "components/VideoInput";
import Code from "components/Code";
const cx = classNames.bind(styles);

interface ICreateProps {
  user: UserType;
  partyId: string;

  onChangeName?: (name: string) => void;
  onAddVideo: (videoId: string) => void;
  onCreateParty: () => void;
}

export const Create: FC<ICreateProps> = ({ user, partyId, onChangeName, onAddVideo, onCreateParty }) => {
  return (
    <div className={cx("create")}>
      <h1>Create new Youtube Watch Party</h1>

      <div className={cx("party__code")}>
        <Code partyId={partyId} />
      </div>

      <div className={cx("party__user")}>
        <input
          className={cx("user-name__input")}
          placeholder="Enter your name"
          value={user.name ?? ""}
          onChange={({ target: { value } }) => onChangeName?.(value)}
        />
      </div>

      <VideoInput onChange={onAddVideo} onClick={onCreateParty} />
    </div>
  );
};
