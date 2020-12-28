import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from "react-redux";

import { Card } from "./interfaces";
import DeckZone from "./components/DeckZone";
import HandZone from "./components/HandZone";
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

  return (
    <>
      <CssBaseline />
      <Grid container className={classes.root} direction="column">
        <Grid className={classes.playZone} item>
          <PlayZone />
        </Grid>
        <Grid className={classes.bottom} container item spacing={2} wrap="wrap">
          <Grid xs={9} item>
            <HandZone playerId={0} />
          </Grid>
          <Grid item xs={3}>
            <DeckZone />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default App;
