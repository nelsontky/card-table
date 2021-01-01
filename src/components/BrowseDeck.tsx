import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@material-ui/core";

import CardComponent from "./CardComponent";
import { Card } from "../interfaces";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflowY: "hidden",
    },
    cardContainer: {
      marginBottom: theme.spacing(1),
    },
    card: {
      margin: "auto",
    },
  })
);

export default function BrowseDeck({
  isOpen,
  setIsOpen,
  ...rest
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  [x: string]: any;
}) {
  const handleClose = () => {
    setIsOpen(false);
  };

  const classes = useStyles();

  const playerId = useSelector((state: any) => state.playerId);
  const deck = useSelector((state: any) => state.game[playerId].deck);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      classes={{ paper: classes.root }}
    >
      <DialogTitle>Deck</DialogTitle>
      <DialogContent>
        <Grid container>
          {deck.map((card: Card, i: number) => (
            <Grid
              key={"browse-deck" + i}
              item
              xs={4}
              className={classes.cardContainer}
            >
              <CardComponent
                card={{ ...card, isFaceDown: false }}
                source="deck"
                disableActions
                noDrag
                size="large"
                className={classes.card}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Disagree
        </Button>
        <Button onClick={handleClose} color="primary" autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}
