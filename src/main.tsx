import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { PubsProvider } from "./context/PubsContext.tsx";

// HashRouter (not BrowserRouter) because GitHub Pages serves static files with
// no server-side rewrite: a direct link to /explore would 404 without it.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <PubsProvider>
        <App />
      </PubsProvider>
    </HashRouter>
  </StrictMode>
);
