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
import { set, remove } from "./slices/yoursSlice";

import dragonicForce from "./decks/dragonicForce.json";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bottom: {
      position: "absolute",
      bottom: theme.spacing(3),
      width: "100%",
    },
  })
);

function App() {
  const classes = useStyles();
  const deck: Card[] = useSelector((state: any) => state.yours.deck);
  const dispatch = useDispatch();

  React.useEffect(() => {
    let id = 0;
    dispatch(
      set({
        section: "deck",
        cards: dragonicForce.reduce((acc, curr) => {
          const next = [...acc];
          for (let i = 0; i < curr.quantity; i++) {
            next.push({ cardId: curr.id, id: id++ });
          }
          return next;
        }, Array<Card>()),
      })
    );
  }, []);

  return (
    <>
      <CssBaseline />
      <Grid container>
        <Grid item xs={12}>
          <PlayZone />
        </Grid>
        <Grid className={classes.bottom} container item spacing={2} wrap="wrap">
          <Grid xs={8} item>
            <HandZone />
          </Grid>
          <Grid item xs={2}>
            {deck.length > 0 && (
              <CardComponent
                dropCb={() => {
                  dispatch(remove({ section: "deck", id: deck[0].id }));
                }}
                faceDown
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
