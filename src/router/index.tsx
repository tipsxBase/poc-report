import { createBrowserRouter, RouteObject } from "react-router-dom";
import Statics from "../pages/Statics";
import Config from "../pages/Config";
import BaseLayout from "../layout/BaseLayout";
import UpdateMetric from "@/pages/UpdateMetric";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      {
        path: "/",
        element: <Statics />,
      },
      {
        path: "/config",
        element: <Config />,
      },
      {
        path: "/update",
        element: <UpdateMetric />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
