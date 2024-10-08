import React, { lazy, Suspense, useRef } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  AppShell,
  createTheme,
  MantineProvider,
  useComputedColorScheme,
} from "@mantine/core";
import Header from "./components/Header";
import { LocaleContextProvider } from "./services/I18n";

import "@mantine/core/styles.css";
import "./index.css";

const Home = lazy(() => import("./pages/Home"));
const Classroom = lazy(() => import("./pages/Classroom"));
const Settings = lazy(() => import("./pages/Settings"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));

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
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/classroom/*" element={<Classroom />} />
                <Route path="/settings/*" element={<Settings />} />
                <Route path="/about/*" element={<About />} />
                <Route path="/login/*" element={<Login />} />
              </Routes>
            </Suspense>
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
