import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      textDecoration: "underline",
      display: "inline",
      margin: "0",
      padding: "0",
      color: theme.palette.primary.main,
      "&:hover": {
        textDecoration: "none",
      },
      "&:focus": {
        textDecoration: "none",
      },
    },
  })
);

export interface ILInkButton {
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  [x: string]: any;
}

export default function LinkButton({
  children,
  onClick,
  ...rest
}: ILInkButton) {
  const classes = useStyles();
  return (
    <button {...rest} type="button" className={classes.root} onClick={onClick}>
      {children}
    </button>
  );
}
