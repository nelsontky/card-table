import React from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { useSelector } from "react-redux";

import { useAppDispatch, RootState } from "../store";
import {
  setCurrentMessage,
  setSnackPack,
  setOpen,
} from "../slices/snackbarsSlice";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Snackbars() {
  const dispatch = useAppDispatch();
  const { open, snackPack, currentMessage } = useSelector(
    (state: RootState) => state.snackbars
  );

  React.useEffect(() => {
    if (snackPack.length && !currentMessage) {
      // Set a new snack when we don't have an active one
      dispatch(setCurrentMessage({ ...snackPack[0] }));
      dispatch(setSnackPack(snackPack.slice(1)));
      dispatch(setOpen(true));
    } else if (snackPack.length && currentMessage && open) {
      // Close an active snack when a new one is added
      dispatch(setOpen(false));
    }
  }, [snackPack, currentMessage, open, dispatch]);

  const handleClose = (_?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(setOpen(false));
  };

  const handleExited = () => {
    dispatch(setCurrentMessage(undefined));
  };

  return (
    <Snackbar
      key={currentMessage?.key}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      onExited={handleExited}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={currentMessage?.severity}>
        {currentMessage?.message}
      </Alert>
    </Snackbar>
  );
}
