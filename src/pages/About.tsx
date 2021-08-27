import React from "react";
import Header from "../components/Header";
import { makeStyles } from "@material-ui/core/styles";
import {
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
} from "@icons-pack/react-simple-icons";
import { Mail } from "@material-ui/icons";

const useStyles = makeStyles({
  root: {
    position: "relative",
    top: "3em",
    width: "20em",
    left: "calc(50% - 10em)",
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
    <div>
      <Header />
      <Card className={classes.root}>
        <CardContent>
          <Typography variant="h5" component="h2">
            關於本站
          </Typography>
          <Typography variant="body2" component="p">
            網頁程式設計助教系統，作為課程作業demo輔助，使用 <code>React</code>{" "}
            和 <code>Material UI</code> 開發。
          </Typography>
          <ImageList className={classes.imgList} rowHeight={40} cols={4}>
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
    </div>
  );
}
