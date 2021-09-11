import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import {
  Notifications,
  Help,
  LibraryBooks,
  Replay,
  Done,
  Create,
  Cancel,
} from "@material-ui/icons";
import FirebaseService from "../../services/FirebaseService";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const RSwal = withReactContent(Swal);

export interface IActions {
  call: () => void;
  cancelCall: () => void;
  commonQuestions: () => void;
  thisWeekHomework: () => void;
  resetSeat: () => void;
  completeDemo: (points: number) => void;
  manualDemo: (id: string, points: number) => void;
}

const useStyles = makeStyles(() => ({
  action: {
    display: "flex",
    flexDirection: "column",
    gap: ".5em",
    placeItems: "center",
    justifyContent: "center",
  },
  dialogRoot: {
    display: "flex",
    flexDirection: "column",
    placeItems: "center",
    gap: ".5em",
  },
  pointSelect: {
    width: "6em",
  },
  dialogActions: {
    display: "flex",
    flexDirection: "row",
    gap: "2em",
    marginTop: "1em",
  },
}));

function StudentActions(props: { isInQueue: boolean; actions: IActions }) {
  const classes = useStyles();
  return (
    <div className={classes.action}>
      <ButtonGroup variant="contained">
        {props.isInQueue ? (
          <Button
            startIcon={<Cancel />}
            color="secondary"
            onClick={props.actions.cancelCall}
          >
            取消呼叫
          </Button>
        ) : (
          <Button
            startIcon={<Notifications />}
            color="primary"
            onClick={props.actions.call}
          >
            呼叫助教
          </Button>
        )}
        <Button
          startIcon={<Help />}
          color="primary"
          onClick={props.actions.commonQuestions}
        >
          常見問題
        </Button>
      </ButtonGroup>
      <ButtonGroup variant="contained">
        <Button
          startIcon={<LibraryBooks />}
          color="primary"
          onClick={props.actions.thisWeekHomework}
        >
          本週作業
        </Button>
        <Button
          startIcon={<Replay />}
          color="secondary"
          onClick={props.actions.resetSeat}
          disabled={props.isInQueue}
        >
          重設座位
        </Button>
      </ButtonGroup>
    </div>
  );
}

function TAActions(props: { waiting?: number; actions: IActions }) {
  const classes = useStyles();
  return (
    <div className={classes.action}>
      <ButtonGroup variant="contained">
        <Button
          startIcon={<Done />}
          color="primary"
          onClick={() => fireCompleteDemoDialog(props.actions)}
          disabled={!props.waiting || props.waiting === 0}
        >
          完成目前
        </Button>
        <Button
          startIcon={<Create />}
          color="primary"
          onClick={() => {
            fireCompleteDemoDialog(props.actions, true);
          }}
        >
          手動Demo
        </Button>
      </ButtonGroup>
    </div>
  );
}

function DemoDialog(props: {
  manual: boolean;
  id?: string;
  maxPoints?: number;
  actions: IActions;
}) {
  const classes = useStyles();
  const [points, setPoints] = useState(0);
  const [id, setId] = useState(props.id);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPoints(event.target.value as number);
  };
  const handleIdChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setId(event.target.value as string);
  };

  const submitPoints = () => {
    if (props.manual) {
      if (!id) return;
      props.actions.manualDemo(id, points);
    } else {
      props.actions.completeDemo(points);
    }
    RSwal.clickConfirm();
  };

  return (
    <div className={classes.dialogRoot}>
      {props.manual ? (
        <TextField
          label="學號"
          required
          variant="filled"
          onChange={handleIdChange}
        />
      ) : (
        <h3>學號：{props.id}</h3>
      )}
      <FormControl variant="filled" required className={classes.pointSelect}>
        <InputLabel id="number-label">題數</InputLabel>
        <Select
          labelId="number-label"
          id="number-select"
          value={points}
          onChange={handleChange}
        >
          {[...Array((props.maxPoints || 0) + 1).keys()].map((p) => (
            <MenuItem value={p} key={p}>
              {p}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className={classes.dialogActions}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => RSwal.clickCancel()}
        >
          取消
        </Button>
        <Button variant="contained" color="primary" onClick={submitPoints}>
          送出
        </Button>
      </div>
    </div>
  );
}

async function fireCompleteDemoDialog(
  actions: IActions,
  manual: boolean = false
) {
  const id = FirebaseService.Instance.currentWaitingQueue?.queue[0].id;
  const maxPoints = FirebaseService.Instance.currentClassTime?.maxPoints;

  const res = await RSwal.fire({
    title: manual ? "手動Demo" : "完成目前Demo",
    html: (
      <DemoDialog
        manual={manual}
        id={id}
        maxPoints={maxPoints}
        actions={actions}
      />
    ),
    showConfirmButton: false,
  });
  if (res.isConfirmed)
    await RSwal.fire({
      title: "成功送出",
      icon: "success",
    });
}

export default function Actions(props: {
  hasLogin?: boolean;
  waiting?: number;
  isInQueue: boolean;
  actions: IActions;
}) {
  if (props.hasLogin)
    return <TAActions waiting={props.waiting} actions={props.actions} />;
  return <StudentActions isInQueue={props.isInQueue} actions={props.actions} />;
}
