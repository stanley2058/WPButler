import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  AppShell,
  createTheme,
  MantineProvider,
  useComputedColorScheme,
} from "@mantine/core";
import Home from "./pages/Home";
import Classroom from "./pages/Classroom";
import About from "./pages/About";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Header from "./components/Header";
import { LocaleContextProvider } from "./services/I18n";

import "@mantine/core/styles.css";
import "./index.css";

export const theme = createTheme({
  primaryColor: "indigo",
});

const root = createRoot(document.getElementById("root")!);
root.render(
  <MantineProvider theme={theme}>
    <LocaleContextProvider>
      <AppShell header={{ height: 60 }} padding="sm">
        <Router>
          <Header />
          <AppShell.Main mt="-60px">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/classroom/*" element={<Classroom />} />
              <Route path="/settings/*" element={<Settings />} />
              <Route path="/about/*" element={<About />} />
              <Route path="/login/*" element={<Login />} />
            </Routes>
          </AppShell.Main>
        </Router>
      </AppShell>
      <SwalTheme />
    </LocaleContextProvider>
  </MantineProvider>,
);

function SwalTheme() {
  const prevTheme = useRef<"dark" | "light" | null>(null);
  const colorScheme = useComputedColorScheme();
  if (prevTheme.current !== colorScheme) {
    prevTheme.current = colorScheme;
    handleSweetalertTheme(colorScheme);
    console.log("swal theme loaded");
  }
  return null;
}
function handleSweetalertTheme(theme: "dark" | "light") {
  const style = document.getElementById("sweetalert-theme") as HTMLLinkElement;
  const url = `https://cdn.jsdelivr.net/npm/@sweetalert2/${
    theme === "dark"
      ? "theme-dark/dark.min.css"
      : "theme-default/default.min.css"
  }`;
  style.href = url;
}
