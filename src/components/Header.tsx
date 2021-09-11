import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@material-ui/core";
import { Class, Info, Settings, ExitToApp } from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";
import FirebaseService from "../services/FirebaseService";

const useStyles = makeStyles((theme) => ({
  root: { flexGrow: 1 },
  menuButton: { marginRight: theme.spacing(2) },
  title: {
    cursor: "pointer",
  },
  list: { width: 200 },
}));

export default function Header() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = useState<{ open: boolean; hasLogin?: boolean }>({
    open: false,
  });
  useEffect(() => {
    const unSub = FirebaseService.Instance.onAuthStateChanged((hasLogin) => {
      if (hasLogin !== state.hasLogin) {
        setState({
          ...state,
          hasLogin,
        });
      }
    });
    return unSub;
  }, []);

  const entries = [
    {
      name: "教室",
      path: "/classroom",
      icon: <Class />,
    },
    {
      name: "助教管理",
      path: "/settings",
      icon: <Settings />,
    },
    {
      name: "關於本站",
      path: "/about",
      icon: <Info />,
    },
  ];

  const toggleDrawer = (open: boolean) => () => {
    setState({ ...state, open });
  };

  const list = (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {entries.map((entry) => (
          <ListItem
            button
            component="a"
            key={entry.name}
            onClick={() => {
              history.push(entry.path);
            }}
          >
            <ListItemIcon>{entry.icon}</ListItemIcon>
            <ListItemText primary={entry.name} />
          </ListItem>
        ))}
        {state.hasLogin && (
          <ListItem
            button
            component="a"
            key="logout"
            onClick={async () => {
              await FirebaseService.Instance.signOut();
              history.push("/");
            }}
          >
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="登出" />
          </ListItem>
        )}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Drawer anchor="left" open={state.open} onClose={toggleDrawer(false)}>
            {list}
          </Drawer>
          <Tooltip title="回首頁">
            <Typography
              variant="h5"
              className={classes.title}
              component="span"
              onClick={() => {
                history.push("/");
              }}
            >
              Web Programming Butler
            </Typography>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </div>
  );
}
