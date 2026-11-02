import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppInitializer from "./AppInitializer.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppInitializer />
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 1000,
          style: {
            background: "#131827",
            color: "white",
            padding: "11px 15px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "550",
            border: "1px solid rgba(190, 199, 218, 0.14)",
            boxShadow: "0 14px 36px rgba(0, 0, 0, 0.34)",
          },
          success: {
            duration: 1000,
            style: {
              background: "#131827",
              border: "1px solid rgba(125, 136, 255, 0.32)",
            },
            iconTheme: {
              primary: "#c9ccff",
              secondary: "#5865f2",
            },
          },
          error: {
            duration: 2500,
            style: {
              background: "#131827",
              border: "1px solid rgba(244, 114, 132, 0.3)",
            },
            iconTheme: {
              primary: "#ffe0e4",
              secondary: "#ef7184",
            },
          },
          loading: {
            style: {
              background: "#131827",
              border: "1px solid rgba(56, 189, 248, 0.25)",
            },
          },
        }}
        containerStyle={{
          top: 14,
          right: 14,
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
