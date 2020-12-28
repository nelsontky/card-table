import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import shuffle from "lodash/shuffle";

import { Card } from "../interfaces";
import CardComponent from "../components/CardComponent";
import { set, remove } from "../slices/gameSlice";

import dragonicForce from "../decks/dragonicForce.json";

const buttons = ["Shuffle"];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: () => ({
      width: "100%",
      borderStyle: "solid",
      borderColor: "white",
      padding: theme.spacing(1),
    }),
  })
);

export default function DeckZone() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const deck: Card[] = useSelector((state: any) => state.game[0].deck);

  const handleClick = (button: string) => {
    switch (button) {
      case "Shuffle":
        dispatch(set({ playerId: 0, section: "deck", cards: shuffle(deck) }));
        break;
      default:
      // TODO throw error here
    }
  };

  React.useEffect(() => {
    let id = 0;
    dispatch(
      set({
        playerId: 0,
        section: "deck",
        cards: dragonicForce.reduce((acc, curr) => {
          const next = [...acc];
          for (let i = 0; i < curr.quantity; i++) {
            next.push({
              cardId: curr.id,
              id: id++,
              isFaceDown: true,
              angle: 0,
            });
          }
          return next;
        }, Array<Card>()),
      })
    );
  }, [dispatch]);

  if (deck.length <= 0) {
    return null;
  }

  return (
    <>
      <Typography variant="caption">Deck</Typography>
      <Grid container className={classes.root}>
        <Grid item md={6} xs={12}>
          <CardComponent
            disableActions
            dropCb={() => {
              dispatch(remove({ playerId: 0, section: "deck", card: deck[0] }));
            }}
            source={"deck"}
            card={deck[0]}
          />
        </Grid>
        <Grid item container md={6} xs={12}>
          {buttons.map((button, i) => (
            <Grid key={"deck-button" + i} item>
              <Button onClick={() => handleClick(button)}>{button}</Button>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
}
