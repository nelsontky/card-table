import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { Grid, LinearProgress } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useCardDimensions } from "../lib/hooks";
import { useParams, useLocation, Prompt } from "react-router-dom";
import qs from "qs";
import Peer from "peerjs";

import DeckZone from "../components/game/DeckZone";
import HandZone from "../components/game/HandZone";
import PlayZone from "../components/game/PlayZone";
import { set as setPlayerId } from "../slices/playerIdSlice";

import { initialize, join, conn } from "../lib/peer";

const useStyles = makeStyles<Theme, { height: number; heightSmall: number }>(
  (theme: Theme) =>
    createStyles({
      root: {
        width: "100%",
        height: "100vh",
        padding: theme.spacing(1),
        margin: "0 auto",
      },
      playZone: {
        flexGrow: 1,
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
  const obj = qs.parse(location.search, { ignoreQueryPrefix: true });
  const deckId = obj.deck as string;

  const dispatch = useDispatch();

  const [opponentDeckId, setOpponentDeckId] = React.useState<string>("");

  React.useEffect(() => {
    return () => {
      if (conn) {
        conn.close();
      }
    };
  }, []);

  React.useEffect(() => {
    const onConnect = () => (_: Peer, conn: Peer.DataConnection) => {
      dispatch(setPlayerId(isHost ? 0 : 1));
      // Send deck id to peer
      conn.send(
        JSON.stringify({
          action: "setDeck",
          deckId,
        })
      );
    };

    const onData = (data: any) => {
      // Set opponent deck id
      const dataObj = JSON.parse(data);
      if (dataObj.action === "setDeck") {
        setOpponentDeckId(dataObj.deckId);
      }
    };

    initialize({
      roomId: isHost ? id : undefined,
      onConnect,
      onData,
      onOpen: !isHost
        ? () => {
            join({ roomId: id, onConnect, onData });
          }
        : undefined,
    });
  }, [dispatch, id, isHost, deckId]);

  const playerId = useSelector((state: any) => state.playerId);

  const isOpponentDeckLoaded = opponentDeckId && opponentDeckId.length !== 0;
  if (playerId === -1 || !isOpponentDeckLoaded) {
    return isHost ? (
      <h1>{`Ask a friend to join room "${id}"`}</h1>
    ) : (
      <h1>Loading...</h1>
    );
  }

  return (
    <>
      <Prompt message="Are you sure you want to leave? Game will be killed upon leaving!" />
      <Grid container className={classes.root} direction="column" spacing={1}>
        <Grid container item wrap="wrap" spacing={1}>
          <Grid xs={9} item>
            <HandZone
              size="small"
              className={classes.handZone}
              playerId={isHost ? 1 : 0}
            />
          </Grid>
          <Grid item xs={3}>
            <React.Suspense fallback={<LinearProgress />}>
              <DeckZone
                deckId={opponentDeckId}
                size="small"
                className={classes.handZone}
                playerId={isHost ? 1 : 0}
              />
            </React.Suspense>
          </Grid>
        </Grid>
        <Grid className={classes.playZone} item>
          <PlayZone playerId={playerId} className={classes.playZone} />
        </Grid>
        <Grid container item wrap="wrap" spacing={1}>
          <Grid xs={9} item>
            <HandZone className={classes.handZone} playerId={isHost ? 0 : 1} />
          </Grid>
          <Grid item xs={3}>
            <React.Suspense fallback={<LinearProgress />}>
              <DeckZone deckId={deckId} playerId={isHost ? 0 : 1} />
            </React.Suspense>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default Game;
