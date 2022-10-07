import { PartyType } from "common/types";
import { Icon } from "components/Icon/Icon";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, FC } from "react";
import db from "service/database";

const PartyPage: FC = () => {
  const router = useRouter();
  const { partyId } = router.query;
  const [party, setParty] = useState<PartyType | null>(null);
  useEffect(() => {
    if (partyId) {
      const load = async () => {
        const data = await db.getParty(partyId?.toString())
        setParty(data);
      };
      load();
    }
  }, [partyId]);

  return (
    <div>
      <Icon />
      <h1 className="text-lg text-pink-900">
        Youtube watch party [{partyId}]
      </h1>
      {party && (<Link href={`/party/${partyId}`}>Join Party!</Link>)}
    </div>
  );
}

export default PartyPage;
