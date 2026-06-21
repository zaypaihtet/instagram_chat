import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Publisher from "./Publisher";
import "./styles.css";

const page = window.location.pathname.startsWith("/publisher") ? (
  <Publisher />
) : (
  <App />
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>{page}</React.StrictMode>,
);
