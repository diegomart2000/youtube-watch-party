import { UserType } from "common/types";
import { createContext, FC, useState, ChangeEvent } from "react";
import { v4 as uuidv4 } from "uuid";

export const SessionContext = createContext<
  UserType & { onChangeName?: (name: string) => void }
>({});

export const SessionProvider: FC = ({ children }) => {
  const [user, setUser] = useState<UserType>({
    userId: uuidv4(),
  });

  const handleSetName = (name: string) => {
    setUser({ ...user, name });
  };

  return (
    <SessionContext.Provider value={{ ...user, onChangeName: handleSetName }}>
      {children}
    </SessionContext.Provider>
  );
};
