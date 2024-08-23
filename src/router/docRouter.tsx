import { createBrowserRouter, RouteObject } from "react-router-dom";
import DocLayout from "@/layout/DocLayout";
import DocRender from "@/pages/DocRender";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <DocLayout />,
    children: [
      {
        path: "/render/:path",
        element: <DocRender />,
      },
    ],
  },
];

const router = createBrowserRouter(routes, { basename: "/doc" });

export default router;
