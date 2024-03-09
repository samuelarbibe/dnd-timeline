import './index.css'
import '@radix-ui/themes/styles.css';
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Theme } from '@radix-ui/themes';

const el = document.getElementById("root");
if (el) {
  const root = createRoot(el);
  root.render(
    <React.StrictMode>
      <Theme>
        <App />
        {/* <ThemePanel /> */}
      </Theme>
    </React.StrictMode>,
  );
} else {
  throw new Error("Could not find root element");
}
