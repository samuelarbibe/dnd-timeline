import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const el = document.getElementById("root");
if (el) {
	const root = createRoot(el);
	root.render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
} else {
	throw new Error("Could not find root element");
}
