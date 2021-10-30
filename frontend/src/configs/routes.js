import EditorDashboard from "../pages/EditorDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ErrorPage from "../pages/ErrorPage";
import GeneralAdminControls from "../components/GeneralAdminControls.js";
import AddEvent from "../components/AddEvent.js";
import Login from "../pages/Login";
import PageNotFound from "../pages/PageNotFound";
import EditorsAdmin from "../pages/EditorsAdmin";
import InvoicesAdmin from "../pages/InvoicesAdmin";
import RulesAdmin from "../pages/RulesAdmin";

const routes = [
  {
    path: "/login",
    component: Login,
    isExact: false,
    role: "editor",
  },
  {
    path: "/",
    component: EditorDashboard,
    isExact: true,
    role: "editor",
  },
  {
    path: "/admin",
    component: AdminDashboard,
    isExact: false,
    role: "admin",
    routes: [
      {
        path: "/admin",
        component: GeneralAdminControls,
        isExact: true,
        role: "admin",
      },
      {
        path: "/admin/invoices",
        component: InvoicesAdmin,
        isExact: false,
        role: "admin",
      },
      {
        path: "/admin/events",
        component: AddEvent,
        isExact: false,
        role: "admin",
      },
      {
        path: "/admin/editors",
        component: EditorsAdmin,
        isExact: false,
        role: "admin",
      },
      // {
      //   path: "/admin/orders",
      //   component: AddEvent,
      //   isExact: false,
      //   role: "admin",
      // },
      {
        path: "/admin/rules",
        component: RulesAdmin,
        isExact: false,
        role: "admin",
      },
      {
        path: "/admin/*",
        component: PageNotFound,
        isExact: false,
        role: "editor",
      },
    ],
  },
  {
    path: "/*",
    component: PageNotFound,
    isExact: false,
    role: "editor",
  },
];

export default routes;
