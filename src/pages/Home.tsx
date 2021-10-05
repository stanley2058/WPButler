import React from "react";
import { createStyles, makeStyles } from "@mui/styles";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  ButtonGroup,
} from "@mui/material";
import { School, Class, Info } from "@mui/icons-material";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      placeItems: "center",
      height: "100%",
    },
    rootGrid: {
      position: "relative",
      top: "6em",
      display: "flex",
      flexDirection: "row",
      placeItems: "center",
      justifyContent: "center",
      maxWidth: "60em",
    },
    card: {
      padding: "1em",
      textAlign: "center",
    },
  })
);

export default function Home() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid className={classes.rootGrid} container>
        <Grid item sm={8} xs={11}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h4" component="h2">
                網頁程式設計助教系統
              </Typography>
            </CardContent>
            <CardActions>
              <ButtonGroup
                orientation="vertical"
                color="primary"
                aria-label="navigation buttons"
                variant="text"
                fullWidth
              >
                <Button
                  href="https://tronclass.ntou.edu.tw/"
                  size="small"
                  target="_blank"
                  startIcon={<School />}
                >
                  Tronclass
                </Button>
                <Button href="/classroom" size="small" startIcon={<Class />}>
                  前往教室
                </Button>
                <Button href="/about" size="small" startIcon={<Info />}>
                  關於本站
                </Button>
              </ButtonGroup>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
