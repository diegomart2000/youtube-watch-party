import { SessionContext } from "components/Session";
import { FC, useContext } from "react";
import { Join } from "./Join";
import { useRouter } from "next/router";

export const JoinContainer: FC = () => {
  const router = useRouter();
  const user = useContext(SessionContext);

  const { partyId } = router.query;

  return (
    <Join
      partyId={partyId?.toString() || ''}
      user={user}
      onChangeName={user.onChangeName}
    />
  );
};
