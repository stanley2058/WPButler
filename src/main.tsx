import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppShell, createTheme, MantineProvider } from "@mantine/core";
import Home from "./pages/Home";
import Classroom from "./pages/Classroom";
import About from "./pages/About";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Header from "./components/Header";

import "@mantine/core/styles.css";
import "./index.css";

export const theme = createTheme({});

const root = createRoot(document.getElementById("root")!);
root.render(
  <MantineProvider theme={theme} forceColorScheme="light">
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
  </MantineProvider>,
);
