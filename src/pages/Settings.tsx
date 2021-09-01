import React from "react";
import { useHistory } from "react-router-dom";
import FirebaseService from "../services/FirebaseService";

export default function Settings() {
  const history = useHistory();
  if (!FirebaseService.Instance.hasLogin) history.push("/login");
  return <div></div>;
}
