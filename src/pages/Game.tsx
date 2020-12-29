import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from "react-redux";
import { useCardDimensions } from "../lib/hooks";

import { Card } from "../interfaces";
import DeckZone from "../components/DeckZone";
import HandZone from "../components/HandZone";
import PlayZone from "../components/PlayZone";
import { set, remove } from "../slices/gameSlice";

import dragonicForce from "../decks/dragonicForce.json";

const useStyles = makeStyles<Theme, { height: number; heightSmall: number }>(
  (theme: Theme) =>
    createStyles({
      root: {
        width: "100%",
        height: "100vh",
        padding: theme.spacing(1),
      },
      playZone: {
        flexGrow: 1,
        marginBottom: theme.spacing(2),
      },
      handZone: ({ height }) => ({
        height: height + theme.spacing(3),
      }),
      handZoneOther: ({ heightSmall }) => ({
        height: heightSmall + theme.spacing(3),
      }),
      bottom: {
        width: "100%",
      },
    })
);

function App() {
  const { height } = useCardDimensions();
  const { height: heightSmall } = useCardDimensions("small");
  const classes = useStyles({ height, heightSmall });

  return (
    <>
      <CssBaseline />
      <Grid container className={classes.root} direction="column">
        <Grid item>
          <HandZone
            className={classes.handZoneOther}
            size="small"
            playerId={0}
          />
        </Grid>
        <Grid className={classes.playZone} item>
          <PlayZone className={classes.playZone} />
        </Grid>
        <Grid className={classes.bottom} container item wrap="wrap" spacing={1}>
          <Grid xs={9} item>
            <HandZone className={classes.handZone} playerId={0} />
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
