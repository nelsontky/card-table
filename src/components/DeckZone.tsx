import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Typography } from "@material-ui/core";
import shuffle from "lodash/shuffle";
import clsx from "clsx";

import { Card } from "../interfaces";
import CardComponent from "../components/CardComponent";
import { set, remove } from "../slices/gameSlice";
import { createDeck } from "../lib/utils";

const buttons = ["Shuffle"];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: () => ({
      width: "100%",
      height: "100%",
      borderStyle: "solid",
      borderColor: "white",
      padding: theme.spacing(1),
    }),
  })
);

export default function DeckZone({
  playerId,
  ...rest
}: {
  playerId: number;
  [x: string]: any;
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const deck: Card[] = useSelector((state: any) => state.game[playerId].deck);

  const myPlayerId = useSelector((state: any) => state.playerId);
  const isMine = myPlayerId === playerId;

  const handleClick = (button: string) => {
    switch (button) {
      case "Shuffle":
        dispatch(set({ playerId, section: "deck", cards: shuffle(deck) }));
        break;
      default:
      // TODO throw error here
    }
  };

  React.useEffect(() => {
    dispatch(
      set({
        playerId,
        section: "deck",
        cards: createDeck({
          deckName: myPlayerId === 0 ? "dragonicForce" : "ninjaOnslaught",
          ownerId: playerId,
        }),
      })
    );
  }, [dispatch, playerId, myPlayerId]);

  if (deck.length <= 0) {
    return null;
  }

  return (
    <Grid container className={clsx(classes.root, rest.className)}>
      <Grid item md={6} xs={12}>
        <CardComponent
          size={rest.size}
          noDrag={!isMine}
          disableActions
          dropCb={() => {
            dispatch(remove({ playerId, section: "deck", card: deck[0] }));
          }}
          source={"deck"}
          card={deck[0]}
        />
      </Grid>
      {isMine && (
        <Grid item container md={6} xs={12}>
          {buttons.map((button, i) => (
            <Grid key={"deck-button" + i} item>
              <Button onClick={() => handleClick(button)}>{button}</Button>
            </Grid>
          ))}
        </Grid>
      )}
    </Grid>
  );
}
