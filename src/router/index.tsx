import { createBrowserRouter, RouteObject } from "react-router-dom";
import BaseLayout from "../layout/BaseLayout";
import CaseManage from "@/pages/CaseManage";
import BusinessManage from "@/pages/BusinessManage";

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
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
