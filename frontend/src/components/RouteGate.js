import { Redirect, Route } from "react-router-dom";

import { useAuthState, useUserRole } from "../contexts";
import ErrorPage from "../pages/ErrorPage";
import { isPermitted } from "../utils";

const RouteGate = ({ path, component: Component, role, routes, ...rest }) => {
  const currentUser = useAuthState();

  const userRole = useUserRole();
  return (
    <Route
      path={path}
      render={(props) => {
        if (!Boolean(currentUser.token)) {
          if (path === "/login")
            return <Component {...props} routes={routes} />;
          return <Redirect to={{ pathname: "/login" }} />;
        }
        if (path === "/login" && Boolean(currentUser.token)) {
          return <Redirect to={{ pathname: "/" }} />;
        }
        if (isPermitted(role, userRole)) {
          return <Component {...props} routes={routes} />;
        }
        return <ErrorPage message="Unauthorized" />;
      }}
      {...rest}
    />
  );
};

export default RouteGate;
