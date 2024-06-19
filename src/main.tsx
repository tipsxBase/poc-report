import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { applyWindowsScrollbarStyle } from "./shared/scrollbarStyle.ts";

applyWindowsScrollbarStyle();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
