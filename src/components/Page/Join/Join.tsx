import { FC } from "react";
import classNames from "classnames/bind";
import styles from "./Join.module.css";
import { UserType } from "common/types";
import Code from "components/Code";
import Link from "next/link";
const cx = classNames.bind(styles);

interface IJoinProps {
  user: UserType;
  partyId: string;

  onChangeName?: (name: string) => void;
}

export const Join: FC<IJoinProps> = ({ user, partyId, onChangeName }) => {
  return (
    <div className={cx("join")}>
      <h1>Join Youtube Watch Party 🎉</h1>

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

      <Link href={`/party/${partyId}`}>Join now!</Link>
    </div>
  );
};
