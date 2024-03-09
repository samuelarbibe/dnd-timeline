import "./global.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import { ThemeProvider } from "@/components/theme-provider";

const el = document.getElementById("root");
if (el) {
  const root = createRoot(el);
  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </React.StrictMode>,
  );
} else {
  throw new Error("Could not find root element");
}
