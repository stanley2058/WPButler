import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  ImageList,
  ImageListItem,
} from "@material-ui/core";
import {
  ReactJs,
  Vite,
  Typescript,
  Materialui,
  Github,
  Googlefonts,
  Firebase,
} from "@icons-pack/react-simple-icons";
import { Mail } from "@material-ui/icons";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    height: "100vh",
    overflowX: "hidden",
  },
  rootGrid: {
    position: "relative",
    top: "3em",
    display: "flex",
    flexDirection: "row",
    placeItems: "center",
    justifyContent: "center",
  },
  imgList: {
    paddingTop: "1em",
  },
});

export default function About() {
  const classes = useStyles();

  const imgList = [
    {
      src: "react",
      img: <ReactJs color="#61DAFB" size={36} />,
      url: "https://reactjs.org/",
    },
    {
      src: "material-ui",
      img: <Materialui color="#0081CB" size={36} />,
      url: "https://material-ui.com/",
    },
    {
      src: "firebase",
      img: <Firebase color="#FFCA28" size={36} />,
      url: "https://firebase.google.com/",
    },
    {
      src: "google-fonts",
      img: <Googlefonts color="#4285F4" size={36} />,
      url: "https://fonts.google.com/",
    },
    {
      src: "vite",
      img: <Vite color="#646CFF" size={36} />,
      url: "https://vitejs.dev/",
    },
    {
      src: "typescript",
      img: <Typescript color="#3178C6" size={36} />,
      url: "https://www.typescriptlang.org/",
    },
  ];

  return (
    <div className={classes.root}>
      <Grid className={classes.rootGrid} container spacing={2}>
        <Grid item sm={4} xs={10}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">
                關於本站
              </Typography>
              <Typography variant="body2" component="p">
                網頁程式設計助教系統，作為課程作業demo輔助，使用{" "}
                <code>React</code> 和 <code>Material UI</code> 開發。
              </Typography>
              <ImageList
                className={classes.imgList}
                rowHeight={40}
                cols={imgList.length}
              >
                {imgList.map((img) => (
                  <ImageListItem key={img.src} cols={1}>
                    <a href={img.url} target="_blank">
                      {img.img}
                    </a>
                  </ImageListItem>
                ))}
              </ImageList>
            </CardContent>
            <CardActions>
              <Button
                href="https://github.com/stanley2058/WPButler"
                size="small"
                target="_blank"
                color="primary"
                startIcon={<Github color="#181717" size={16} />}
              >
                Github
              </Button>
              <Button
                href="mailto:10957032@email.ntou.edu.tw"
                size="small"
                target="_blank"
                color="primary"
                startIcon={<Mail />}
              >
                聯絡助教
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
