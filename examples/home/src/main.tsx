import "./index.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const el = document.getElementById("root");
if (el) {
	const root = createRoot(el);
	root.render(
		<StrictMode>
			<Theme>
				<App />
				{/* <ThemePanel /> */}
			</Theme>
		</StrictMode>,
	);
} else {
	throw new Error("Could not find root element");
}
