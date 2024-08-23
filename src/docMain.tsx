import ReactDOM from "react-dom/client";
import "./index.css";
import { applyWindowsScrollbarStyle } from "./shared/scrollbarStyle.ts";
import DocApp from "./DocApp.tsx";

applyWindowsScrollbarStyle();

ReactDOM.createRoot(document.getElementById("root")!).render(<DocApp />);
