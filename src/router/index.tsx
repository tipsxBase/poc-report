import { createBrowserRouter, RouteObject } from "react-router-dom";
import BaseLayout from "../layout/BaseLayout";
import CaseManage from "@/pages/CaseManage";
import BusinessManage from "@/pages/BusinessManage";
import DDLManage from "@/pages/DDLManage";
import ResourceManage from "@/pages/ResourceManage";
import DataInitial from "@/pages/DataInitial";

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
        path: "/ddl",
        element: <DDLManage />,
      },
      {
        path: "/resource",
        element: <ResourceManage />,
      },
      {
        path: "/initial",
        element: <DataInitial />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
