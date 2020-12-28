import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from "react-redux";

import { Card } from "./interfaces";
import Deck from "./components/Deck";
import HandZone from "./components/HandZone";
import CardComponent from "./components/CardComponent";
import PlayZone from "./components/PlayZone";
import { set, remove } from "./slices/gameSlice";

import dragonicForce from "./decks/dragonicForce.json";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "95vh",
      width: "100%",
      padding: theme.spacing(1),
    },
    playZone: {
      flexGrow: 1,
      margin: theme.spacing(2, 0, 2, 0),
    },
    bottom: {
      width: "100%",
    },
  })
);

function App() {
  const classes = useStyles();
  const deck: Card[] = useSelector((state: any) => state.game[0].deck);
  const dispatch = useDispatch();

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
            });
          }
          return next;
        }, Array<Card>()),
      })
    );
  }, []);

  return (
    <>
      <CssBaseline />
      <Grid container className={classes.root} direction="column">
        <Grid className={classes.playZone} item>
          <PlayZone />
        </Grid>
        <Grid className={classes.bottom} container item spacing={2} wrap="wrap">
          <Grid xs={10} item>
            <HandZone playerId={0} />
          </Grid>
          <Grid item xs={2}>
            {deck.length > 0 && (
              <CardComponent
                dropCb={() => {
                  dispatch(
                    remove({ playerId: 0, section: "deck", card: deck[0] })
                  );
                }}
                source={"deck"}
                card={deck[0]}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default App;
