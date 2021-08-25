import React, { useState, KeyboardEvent, MouseEvent } from "react";
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
} from "@material-ui/core";
import { Class, Info } from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: { flexGrow: 1 },
  menuButton: { marginRight: theme.spacing(2) },
  title: { flexGrow: 1 },
  list: { width: 200 },
}));

export default function Header() {
  const classes = useStyles();
  const [state, setState] = useState({ open: false });
  const history = useHistory();

  const entries = [
    {
      name: "教室",
      path: "/",
      icon: <Class />,
      action: () => history.push("/"),
    },
    {
      name: "關於本站",
      path: "/about",
      icon: <Info />,
      action: () => history.push("/about"),
    },
  ];

  const toggleDrawer =
    (open: boolean) => (event: KeyboardEvent | MouseEvent) => {
      setState({ ...state, open });
      console.log(event);
    };

  const list = () => (
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
            onClick={entry.action}
          >
            <ListItemIcon>{entry.icon}</ListItemIcon>
            <ListItemText primary={entry.name} />
          </ListItem>
        ))}
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
            {list()}
          </Drawer>
          <Typography variant="h5" className={classes.title}>
            Web Programming Butler
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
