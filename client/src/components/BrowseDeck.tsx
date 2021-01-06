import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Checkbox,
} from "@material-ui/core";

import CardComponent from "./CardComponent";
import { Card, CrudGame } from "../interfaces";
import { add, remove } from "../slices/gameSlice";
import { conn } from "../lib/peer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflowY: "hidden",
      maxWidth: "75vh",
    },
    cardContainer: {
      marginBottom: theme.spacing(1),
      position: "relative",
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
  const classes = useStyles();
  const dispatch = useDispatch();

  const playerId = useSelector((state: any) => state.playerId);
  const deck = useSelector((state: any) => state.game[playerId].deck);

  const noneSelected = deck.reduce(
    (acc: { [x: string]: boolean }, curr: Card) => ({
      ...acc,
      [curr.id]: false,
    }),
    {}
  );

  const [selected, setSelected] = React.useState(noneSelected);
  const handleClose = () => {
    setIsOpen(false);
    setSelected(noneSelected);
  };

  const drawSelected = () => {
    for (const id of Object.keys(selected)) {
      if (selected[id]) {
        const cardToDraw = deck.find((card: Card) => card.id === id);

        const removePayload = {
          card: cardToDraw,
          playerId,
          section: "deck",
        } as CrudGame;
        dispatch(remove(removePayload));

        if (conn) {
          conn.send(
            JSON.stringify({
              action: "remove",
              ...removePayload,
            })
          );
        }

        const addPayload = {
          card: { ...cardToDraw, isFaceDown: false },
          playerId,
          section: "hand",
        } as CrudGame;
        dispatch(add(addPayload));

        if (conn) {
          conn.send(
            JSON.stringify({
              action: "add",
              ...addPayload,
            })
          );
        }
      }
    }

    handleClose();
  };

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
              lg={4}
              md={6}
              xs={12}
              className={classes.cardContainer}
              container
              wrap="nowrap"
            >
              <Grid item>
                <Checkbox
                  checked={selected[card.id]}
                  onChange={(e) => {
                    setSelected({ ...selected, [card.id]: e.target.checked });
                  }}
                />
              </Grid>
              <Grid item>
                <CardComponent
                  card={{ ...card, isFaceDown: false }}
                  source="deck"
                  disableActions
                  noDrag
                  size="large"
                  className={classes.card}
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={drawSelected} autoFocus>
          Draw selected
        </Button>
      </DialogActions>
    </Dialog>
  );
}
