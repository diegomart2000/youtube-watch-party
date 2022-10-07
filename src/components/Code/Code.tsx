import { FC, useCallback, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Code.module.css";
const cx = classNames.bind(styles);

export const Code: FC<{ partyId: string }> = ({ partyId }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = useCallback(() => {
      navigator.clipboard.writeText(`${location.origin}/join/${partyId}`);
      setCopied(true);
    }, [partyId]);

  return (
    <div className={cx("code")}>
      {partyId.split("").map((char, i) => (
        <span key={`code-${char}-${i}`}>{char}</span>
      ))}{" "}
      <a onClick={handleCopy} title="Copy invite link">
        {copied ? "✌️" : "🔗"}
      </a>
    </div>
  );
};
