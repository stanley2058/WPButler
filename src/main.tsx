import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./index.css";
import Classroom from "./pages/Classroom";
import About from "./pages/About";

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/">
        <Classroom />
      </Route>
      <Route path="/about">
        <About />
      </Route>
    </div>
  </Router>,
  document.getElementById("root")
);
