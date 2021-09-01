import React, { SyntheticEvent } from "react";
import {
  Button,
  Card,
  CardContent,
  makeStyles,
  Typography,
  TextField,
} from "@material-ui/core";
import FirebaseService from "../services/FirebaseService";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    placeItems: "center",
    top: "3em",
    position: "relative",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    marginTop: "1em",
  },
  actions: {
    marginTop: "1em",
    display: "flex",
    justifyContent: "center",
    placeItems: "center",
  },
});
export default function Login() {
  const history = useHistory();
  (async () => {
    if (await FirebaseService.Instance.hasLogin) history.push("/settings");
  })();
  const classes = useStyles();

  const login = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      email: { value: string };
      password: { value: string };
    };

    const fireError = async () => {
      await Swal.fire({
        icon: "error",
        title: "登入失敗",
        text: "帳號或密碼錯誤",
      });
    };
    try {
      const res = await FirebaseService.Instance.signIn(
        target.email.value,
        target.password.value
      );
      if (res) history.push("/settings");
      else await fireError();
    } catch (error) {
      // login failed
      await fireError();
    }
  };

  return (
    <div className={classes.root}>
      <Card>
        <CardContent>
          <form className={classes.form} autoComplete="off" onSubmit={login}>
            <Typography variant="h5" component="h2">
              助教登入
            </Typography>
            <TextField
              required
              variant="filled"
              margin="dense"
              label="信箱"
              type="email"
              name="email"
            />
            <TextField
              required
              variant="filled"
              margin="dense"
              label="密碼"
              type="password"
              name="password"
            />
            <div className={classes.actions}>
              <Button variant="contained" color="primary" type="submit">
                登入
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
