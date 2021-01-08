import React from "react";
import {
  Box,
  GridList,
  GridListTile,
  GridListTileBar,
  Typography,
  LinearProgress,
  Grid,
  Button,
} from "@material-ui/core";
import {
  Theme,
  createStyles,
  makeStyles,
  useTheme,
} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import useSWR from "swr";
import { useHistory, Link } from "react-router-dom";

import { useUser } from "../lib/hooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
    },
    tile: {
      backgroundColor: theme.palette.background.paper,
    },
    image: {
      top: "100%",
    },
    title: {
      color: theme.palette.primary.light,
    },
    titleBar: {
      background:
        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
    },
  })
);

export default function Decks({ openLogin }: { openLogin: () => void }) {
  const user = useUser();
  const history = useHistory();

  return (
    <>
      <Grid container justify="space-between">
        <Grid item>
          <Typography variant="h6" gutterBottom>
            My Decks
          </Typography>
        </Grid>
        {user && (
          <Grid item>
            <Button
              onClick={() => {
                history.push("/decks/create");
              }}
              color="primary"
            >
              Create Deck
            </Button>
          </Grid>
        )}
      </Grid>
      {!user ? (
        <Box textAlign="center">
          <Typography variant="caption">
            <a
              onClick={(e) => {
                e.preventDefault();
                openLogin();
              }}
              href=""
            >
              Sign in/sign up
            </a>{" "}
            to create your own custom decks!
          </Typography>
        </Box>
      ) : (
        <React.Suspense fallback={<LinearProgress />}>
          <ListDecks endpoint="/decks/mine" />
        </React.Suspense>
      )}
      <Typography variant="h6" gutterBottom>
        Pre-made Decks
      </Typography>
      <React.Suspense fallback={<LinearProgress />}>
        <ListDecks endpoint="/decks" />
      </React.Suspense>
    </>
  );
}

function ListDecks({ endpoint }: { endpoint: string }) {
  const classes = useStyles();

  const { data: decks } = useSWR(endpoint);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.up("md"));

  if (!decks?.length || decks.length === 0) {
    return (
      <Box textAlign="center">
        <Typography variant="caption">
          You do not have any decks.{" "}
          <Link to="/decks/create">Create one now!</Link>
        </Typography>
      </Box>
    );
  }

  return (
    <div className={classes.root}>
      <GridList
        cellHeight={160}
        spacing={8}
        cols={isMedium ? 3 : isSmall ? 2 : 1}
      >
        {decks.map((deck: any) => (
          <GridListTile key={deck.id} className={classes.tile}>
            <img
              src={
                process.env.REACT_APP_S3_HOST +
                deck.cardQuantities[0].card.id +
                ".png"
              }
              alt={deck.name}
              className={classes.image}
            />
            <GridListTileBar title={deck.name} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
