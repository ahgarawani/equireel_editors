import EditorDashboard from "../pages/EditorDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import PageNotFound from "../pages/PageNotFound";

const routes = [
  {
    path: "/",
    component: EditorDashboard,
    isPrivate: true,
    role: "editor",
  },
  {
    path: "/admin",
    component: AdminDashboard,
    isPrivate: true,
    role: "admin",
  },
  {
    path: "/*",
    component: PageNotFound,
    isPrivate: true,
    role: "editor",
  },
];

export default routes;
