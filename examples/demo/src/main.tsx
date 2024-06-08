import "./global.css";
import { ThemeProvider } from "@/components/theme-provider";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const el = document.getElementById("root");
if (el) {
	const root = createRoot(el);
	root.render(
		<StrictMode>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<App />
			</ThemeProvider>
		</StrictMode>,
	);
} else {
	throw new Error("Could not find root element");
}
