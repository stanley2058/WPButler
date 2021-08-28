import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Classroom from "./pages/Classroom";
import About from "./pages/About";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Header from "./components/Header";

ReactDOM.render(
  <Router>
    <div>
      <Header />
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/classroom">
        <Classroom />
      </Route>
      <Route path="/settings">
        <Settings />
      </Route>
      <Route path="/about">
        <About />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
    </div>
  </Router>,
  document.getElementById("root")
);
