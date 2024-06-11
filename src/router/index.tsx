import { createBrowserRouter, RouteObject } from "react-router-dom";
import BaseLayout from "../layout/BaseLayout";
import CaseManage from "@/pages/CaseManage";
import BusinessManage from "@/pages/BusinessManage";
import ServerManage from "@/pages/ServerManage";
import DDLManage from "@/pages/DDLManage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      {
        path: "/",
        element: <CaseManage />,
      },
      {
        path: "/business",
        element: <BusinessManage />,
      },
      {
        path: "/server",
        element: <ServerManage />,
      },
      {
        path: "/ddl",
        element: <DDLManage />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
