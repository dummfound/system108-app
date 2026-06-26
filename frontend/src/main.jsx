import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WebApp from "@twa-dev/sdk";
import App from "./App";
import "./index.css";

WebApp.ready();
WebApp.expand();
WebApp.setHeaderColor("#0a0a0a");
WebApp.setBackgroundColor("#0a0a0a");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
