import { Redirect, Route } from "react-router-dom";

import { useAuthState, useUserRole } from "../contexts";
import ErrorPage from "../pages/ErrorPage";
import { isPermitted } from "../utils";

const RouteGate = ({ component: Component, path, role, ...rest }) => {
  const currentUser = useAuthState();

  const userRole = useUserRole();
  return (
    <Route
      path={path}
      render={(props) => {
        if (!Boolean(currentUser.token)) {
          return <Redirect to={{ pathname: "/login" }} />;
        }
        if (isPermitted(role, userRole)) {
          return <Component {...props} />;
        }
        return <ErrorPage message="Unauthorized" />;
      }}
      {...rest}
    />
  );
};

export default RouteGate;
