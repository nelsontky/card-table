import React from "react";
import { Backdrop, IconButton, Grid, BackdropProps } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

import { Close as CloseIcon } from "@material-ui/icons";

export interface IClosableBackdrop {
  isOpen: boolean;
  close: () => void;
  children: React.ReactChild | React.ReactChildren;
  BackdropProps?: BackdropProps;
  [x: string]: any;
}

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
  BackdropProps,
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
        {...BackdropProps}
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
