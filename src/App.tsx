import { RouterProvider } from "react-router-dom";
import router from "./router/index.tsx";
import "@arco-themes/react-bench/index.less";
function App() {
  return <RouterProvider router={router} />;
}

export default App;
