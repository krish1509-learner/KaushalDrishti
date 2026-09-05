import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import KaushalDrishtiApp from "../frontend.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <KaushalDrishtiApp />
  </StrictMode>,
);
