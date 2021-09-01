import React from "react";
import { useHistory } from "react-router-dom";
import FirebaseService from "../services/FirebaseService";

export default function Settings() {
  const history = useHistory();
  (async () => {
    if (!(await FirebaseService.Instance.hasLogin)) history.push("/login");
  })();
  return <div></div>;
}
