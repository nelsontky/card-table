import React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

import CloseIcon from "@material-ui/icons/Close";

import { IClosableBackdrop } from "../interfaces";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
);

export default function ClosableBackdrop({
  isOpen,
  close,
  children,
  ...rest
}: IClosableBackdrop) {
  const classes = useStyles();

  return (
    <>
      <Backdrop
        className={classes.backdrop}
        open={isOpen}
        onClick={close}
        {...rest}
      >
        <Grid container justify="center">
          <Grid item>{children}</Grid>
          <Grid item>
            <IconButton size="small" onClick={close}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Backdrop>
    </>
  );
}
