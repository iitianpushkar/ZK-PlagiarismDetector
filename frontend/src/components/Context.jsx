import React, { createContext, useState } from 'react';

export const UserContext = createContext();

function Context({ children }) {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);

  return (
    <UserContext.Provider value={{ account, setAccount, contract, setContract }}>
      {children}
    </UserContext.Provider>
  );
}

export default Context;
