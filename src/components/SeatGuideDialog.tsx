import React, { useState, ChangeEvent } from "react";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import Swal from "sweetalert2";
import ClassroomUtils from "../services/ClassroomUtils";

const useStyles = makeStyles((theme: Theme) => ({
  rotationActions: {
    display: "flex",
    flexDirection: "column",
    placeItems: "center",
    justifyContent: "center",
    wordBreak: "break-word",
  },
}));

export default function SeatGuideDialog(props: {
  open: boolean;
  onClose: (id: string, rotation: number) => void;
}) {
  const classes = useStyles();
  const [state, setState] = useState<{
    isLeft?: boolean;
    isOpen: boolean;
    canComplete: boolean;
    id?: string;
  }>({
    isOpen: props.open,
    canComplete: false,
  });

  ClassroomUtils.onGuideDialogOpenStateChange((open) => {
    if (open)
      setState({
        isOpen: open,
        canComplete: false,
      });
    else setState({ ...state, isOpen: open });
  });

  const onClose = async () => {
    if (!state.id) return;
    setState({ ...state, isOpen: false });
    await Swal.fire({
      icon: "info",
      title: "選擇座位",
      text: "點選教室平面圖上面的座位來設定目前的位子。",
    });
    props.onClose(state.id, state.isLeft ? 2 : 0);
  };
  const chooseTeacherPosition = (isLeft: boolean) => {
    setState({
      ...state,
      isLeft,
      canComplete: !!state.id,
    });
  };
  const getVariant = (isLeft: boolean) => {
    if (state.isLeft === isLeft) return "contained";
    return "outlined";
  };
  const getColor = (isLeft: boolean) => {
    if (state.isLeft === isLeft) return "primary";
    return "default";
  };
  const onIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    const id = event.target.value.trim();
    setState({ ...state, id, canComplete: !!id && state.isLeft !== undefined });
  };

  return (
    <Dialog open={state.isOpen} onClose={onClose}>
      <DialogTitle>快速設定</DialogTitle>
      <DialogContent>
        <List>
          <ListItem>
            <TextField
              fullWidth
              variant="outlined"
              required
              label="學號"
              onChange={onIdChange}
            />
          </ListItem>
          <ListItem className={classes.rotationActions}>
            <Typography>電腦在我的前面的話，老師坐在我的...？</Typography>
            <ButtonGroup fullWidth>
              <Button
                variant={getVariant(true)}
                color={getColor(true)}
                onClick={() => {
                  chooseTeacherPosition(true);
                }}
              >
                左邊
              </Button>
              <Button
                variant={getVariant(false)}
                color={getColor(false)}
                onClick={() => {
                  chooseTeacherPosition(false);
                }}
              >
                右邊
              </Button>
            </ButtonGroup>
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={!state.canComplete}
          variant="contained"
          color="primary"
          onClick={onClose}
        >
          完成
        </Button>
      </DialogActions>
    </Dialog>
  );
}
