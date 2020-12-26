import React from "react";
import Paper from "@material-ui/core/Paper";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: theme.palette.common.white,
      width: "100px",
      height: "140px",
    },
  })
);

export default function Deck({ ...rest }) {
  const classes = useStyles();

  return <Paper className={clsx(classes.root, rest.className)} />;
}
