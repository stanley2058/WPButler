import React, { PropsWithChildren, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FirebaseService from "../services/FirebaseService";
import ClassSessionCreator from "../components/Settings/ClassSessionCreator";
import GradeSum from "../components/Settings/GradeSum";
import TASettings from "../components/Settings/TASettings";

const useStyles = makeStyles({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    placeItems: "center",
    justifyContent: "center",
    marginTop: "2em",
    marginBottom: "2em",
  },
  accordionBase: {
    marginLeft: "1em",
    marginRight: "1em",
    width: "clamp(50%, 40em, 90%)",
  },
  accordionTitle: {
    fontSize: ".9em",
    fontWeight: "bold",
  },
  accordionContent: {
    display: "flex",
    flexDirection: "column",
  },
  sectionTitle: {
    marginTop: "2em",
  },
});

function CustomAccordion(props: PropsWithChildren<{ title: string }>) {
  const classes = useStyles();
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.accordionTitle}>
          {props.title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionContent}>
        {props.children}
      </AccordionDetails>
    </Accordion>
  );
}

export default function Settings() {
  const classes = useStyles();
  const [loginEmail, setLoginEmail] = useState("");

  const history = useHistory();
  useEffect(() => {
    const checkAuth = async () => {
      if (!(await FirebaseService.Instance.hasLogin)) history.push("/login");
      setLoginEmail(FirebaseService.Instance.currentUser?.email || "");
    };
    checkAuth();
  }, []);
  return (
    <div className={classes.root}>
      <div className={classes.accordionBase}>
        <Typography variant="h5">目前登入：{loginEmail}</Typography>

        <Typography sx={{ marginTop: "2em" }} variant="h6">
          課程相關
        </Typography>

        <CustomAccordion title="編輯課程">
          <ClassSessionCreator />
        </CustomAccordion>

        <CustomAccordion title="成績統計">
          <GradeSum />
        </CustomAccordion>

        <Typography sx={{ marginTop: "2em" }} variant="h6">
          助教設定
        </Typography>

        <CustomAccordion title="助教設定">
          <TASettings />
        </CustomAccordion>
      </div>
    </div>
  );
}
