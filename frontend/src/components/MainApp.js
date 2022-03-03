import { useEffect } from "react";
import { Switch } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import routes from "../configs/routes.js";
import { logout, useAuthState, useAuthDispatch } from "../contexts";

import RouteGate from "./RouteGate";

function MainApp() {
  const ROOT_URL = process.env.REACT_APP_API_HOST_URL;
  const dispatch = useAuthDispatch(); // read dispatch method from context
  const currentUser = useAuthState(); //read user details from context

  useEffect(() => {
    async function checkIfValidJWT() {
      if (currentUser.token) {
        try {
          let res = await fetch(`${ROOT_URL}/auth/validJWT`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: currentUser.token }),
          });
          let resData = await res.json();
          if (!resData.valid) {
            logout(dispatch);
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
    checkIfValidJWT();
  }, [ROOT_URL, currentUser]);
  return (
    <Box bg="#fafafa" minH="100vh" minW="100vw">
      <Switch>
        {routes.map((route) => (
          <RouteGate
            key={route.path}
            path={route.path}
            component={route.component}
            role={route.role}
            routes={route.routes}
            exact={route.isExact}
          />
        ))}
      </Switch>
    </Box>
  );
}

export default MainApp;
