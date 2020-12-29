import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from "react-redux";
import { useCardDimensions } from "../lib/hooks";
import { useParams, useLocation } from "react-router-dom";

import DeckZone from "../components/DeckZone";
import HandZone from "../components/HandZone";
import PlayZone from "../components/PlayZone";
import { set, remove } from "../slices/gameSlice";
import { set as setPlayerId } from "../slices/playerIdSlice";

import { getPeer, getConn, handleData } from "../lib/peer";

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

function Game() {
  const { height } = useCardDimensions();
  const { height: heightSmall } = useCardDimensions("small");
  const classes = useStyles({ height, heightSmall });
  const { id } = useParams<{ id: string }>();
  const location = useLocation<any>();
  const isHost = !!location.state?.isHost;

  const dispatch = useDispatch();

  React.useEffect(() => {
    const peer = isHost ? getPeer(id) : getPeer();

    peer.on("open", (peerId) => {
      if (isHost) {
        getConn().then((conn) => {
          dispatch(setPlayerId(0));
          conn.on("data", (data) => {
            handleData(data);
          });
        });
      } else {
        getConn(id).then((conn) => {
          dispatch(setPlayerId(1));
          conn.on("data", (data) => {
            handleData(data);
          });
        });
      }
    });
  }, []);

  const playerId = useSelector((state: any) => state.playerId);

  if (playerId === -1) {
    return isHost ? (
      <h1>{`Ask a friend to join room "${id}"`}</h1>
    ) : (
      <h1>Loading...</h1>
    );
  }

  return (
    <Grid container className={classes.root} direction="column">
      <Grid className={classes.bottom} container item wrap="wrap" spacing={1}>
        <Grid xs={9} item>
          <HandZone className={classes.handZone} playerId={isHost ? 1 : 0} />
        </Grid>
        <Grid item xs={3}>
          <DeckZone className={classes.handZone} playerId={isHost ? 1 : 0} />
        </Grid>
      </Grid>
      <Grid className={classes.playZone} item>
        <PlayZone playerId={playerId} className={classes.playZone} />
      </Grid>
      <Grid className={classes.bottom} container item wrap="wrap" spacing={1}>
        <Grid xs={9} item>
          <HandZone className={classes.handZone} playerId={isHost ? 0 : 1} />
        </Grid>
        <Grid item xs={3}>
          <DeckZone playerId={isHost ? 0 : 1} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Game;
