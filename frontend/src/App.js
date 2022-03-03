import "./App.css";
import { AuthProvider, UserRoleProvider } from "./contexts";

import MainApp from "./components/MainApp";

function App() {
  return (
    <AuthProvider>
      <UserRoleProvider>
        <MainApp />
      </UserRoleProvider>
    </AuthProvider>
  );
}

export default App;
