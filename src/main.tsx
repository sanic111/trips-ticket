import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/assets/styles/main.scss";
import App from "@/App.tsx";
import  "@/i18n.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    
    <App />
  </StrictMode>
);
