import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Button, TextField, Typography } from "@mui/material";
import FirebaseService from "../../services/FirebaseService";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(() => ({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: ".5em",
  },
  mono: {
    fontFamily: "monospace",
    backgroundColor: "lightgray",
    marginLeft: "2px",
    marginRight: "2px",
    paddingLeft: "2px",
    paddingRight: "2px",
  },
}));
export default function TASettings() {
  const history = useHistory();
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [newPasswd, setNewPasswd] = useState("");

  const updatePassed = async () => {
    try {
      await FirebaseService.Instance.changePassword(newPasswd);
      await Swal.fire({
        icon: "success",
        title: "更新密碼",
        text: "成功更新密碼，請重新登入。",
      });
      await FirebaseService.Instance.signOut();
      history.push("/login");
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "更新密碼",
        text: "發生錯誤，請參考瀏覽器Console。",
      });
    }
  };
  const addAccount = async () => {
    try {
      await FirebaseService.Instance.createAccount(email);
      await Swal.fire({
        icon: "success",
        title: "建立帳號",
        text: "成功建立新助教帳號，請重新登入。",
      });
      await FirebaseService.Instance.signOut();
      history.push("/login");
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "建立帳號",
        text: "發生錯誤，請參考瀏覽器Console。",
      });
    }
  };

  return (
    <div>
      <Typography variant="h6" sx={{ fontSize: ".9em", marginBottom: ".5em" }}>
        更新密碼
      </Typography>

      <form
        className={classes.form}
        onSubmit={(e) => {
          e.preventDefault();
          updatePassed();
        }}
      >
        <TextField
          required
          label="新密碼"
          type="password"
          value={newPasswd}
          onChange={(e) => setNewPasswd(e.target.value)}
        />
        <Button variant="contained" color="error" type="submit">
          更新
        </Button>
      </form>

      <Typography
        variant="h6"
        sx={{ fontSize: ".9em", marginTop: "3em", marginBottom: ".5em" }}
      >
        新增助教
      </Typography>
      <form
        className={classes.form}
        onSubmit={(e) => {
          e.preventDefault();
          addAccount();
        }}
      >
        <TextField
          required
          label="信箱"
          type="email"
          value={email}
          onChange={(em) => setEmail(em.target.value)}
        />
        <Button variant="contained" color="primary" type="submit">
          新增
        </Button>
        <Typography variant="caption">
          <i>
            *新帳號預設密碼為<span className={classes.mono}>soselab401</span>
            登入後請自行更新密碼。
          </i>
        </Typography>
      </form>
    </div>
  );
}
