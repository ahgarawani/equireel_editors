import "./App.css";
import { Switch, Route } from "react-router-dom";
import routes from "./configs/routes.js";
import { AuthProvider, UserRoleProvider } from "./contexts";
import Login from "./pages/Login";
import RouteGate from "./components/RouteGate";

function App() {
  return (
    <AuthProvider>
      <UserRoleProvider>
        <Switch>
          <Route path="/login" render={Login} exact>
            <Login />
          </Route>
          {routes.map((route) => (
            <RouteGate
              key={route.path}
              path={route.path}
              component={route.component}
              role={route.role}
              exact
            />
          ))}
        </Switch>
      </UserRoleProvider>
    </AuthProvider>
  );
}

export default App;
