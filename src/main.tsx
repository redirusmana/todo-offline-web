import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./globals.css";
import App from "./App.tsx";
import { ThemeProvider, CssBaseline } from "@mui/material";
import AppTheme from "./AppTheme.tsx"; 
const lightAppTheme = AppTheme();

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={lightAppTheme}>
    <StrictMode>
      <CssBaseline />
      <App />
    </StrictMode>
  </ThemeProvider>
);