import "./App.css";
import { Switch } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import routes from "./configs/routes.js";
import { AuthProvider, UserRoleProvider } from "./contexts";

import RouteGate from "./components/RouteGate";

function App() {
  return (
    <AuthProvider>
      <UserRoleProvider>
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
      </UserRoleProvider>
    </AuthProvider>
  );
}

export default App;
