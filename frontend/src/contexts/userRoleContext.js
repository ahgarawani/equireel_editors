import React, { useState, useEffect } from "react";
import { useAuthState } from "./contexts";

const UserRoleContext = React.createContext();

export function useUserRole() {
  const context = React.useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }

  return context;
}

export const UserRoleProvider = ({ children }) => {
  const ROOT_URL = process.env.REACT_APP_API_HOST_URL;
  const currentUser = useAuthState();

  const [initialUserRole, setInitialUserRole] = useState(
    currentUser.userDetails.role
  );

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        let res = await fetch(`${ROOT_URL}/auth/role`, {
          headers: {
            Authorization: "Bearer " + currentUser.token,
          },
        });
        if (res.status !== 200) {
          throw new Error("Failed to fetch role.");
        }
        let resData = await res.json();
        setInitialUserRole(resData.role);
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            token: currentUser.token,
            user: { ...currentUser.userDetails, role: initialUserRole },
          })
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserRole();
  }, [ROOT_URL, currentUser, initialUserRole]);

  return (
    <UserRoleContext.Provider value={initialUserRole}>
      {children}
    </UserRoleContext.Provider>
  );
};
