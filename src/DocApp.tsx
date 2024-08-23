import { RouterProvider } from "react-router-dom";
import router from "./router/docRouter";

function DocApp() {
  return <RouterProvider router={router} />;
}

export default DocApp;
