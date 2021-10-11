import { Redirect } from "react-router-dom";

import { useAuthState, useUserRole } from "../contexts";

import { isPermitted } from "../utils";

function ComponentGate({ children, role }) {
  const currentUser = useAuthState();

  const userRole = useUserRole();

  if (!Boolean(currentUser.token)) {
    return <Redirect to={{ pathname: "/login" }} />;
  }
  if (isPermitted(role, userRole)) {
    return <>{children}</>;
  }
  return <></>;
}

export default ComponentGate;
