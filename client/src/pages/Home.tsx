import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Box,
} from "@material-ui/core";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

import { Send as SendIcon } from "@material-ui/icons";
import firebase from "firebase";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
    },
    marginBottom: {
      marginBottom: theme.spacing(1),
    },
  })
);

export default function Home() {
  const classes = useStyles();
  const history = useHistory();

  const [roomId, setRoomId] = React.useState<number | "">("");

  const onSubmit = (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (roomId !== "") {
      history.push("/" + roomId);
    }
  };

  const startNewGame = () => {
    const peerId = Math.floor(Math.random() * 10000) + "";
    history.push({ pathname: "/" + peerId, state: { isHost: true } });
  };

  // Configure FirebaseUI.
  const uiConfig = {
    signInFlow: "redirect",
    signInSuccessUrl: "/",
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      },
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false,
    },
  };

  const currUser = firebase.auth().currentUser;
  console.log(currUser);

  if (currUser) {
    currUser
      .getIdToken(/* forceRefresh */ true)
      .then(function (idToken) {
        console.log(idToken);
      })
      .catch(function (error) {
        // Handle error
      });
  }

  return (
    <Container maxWidth="md" className={classes.root}>
      <Typography gutterBottom variant="h5">
        Play a game
      </Typography>
      <Grid
        container
        direction="column"
        spacing={2}
        justify="center"
        className={classes.marginBottom}
      >
        <Grid item>
          <form noValidate autoComplete="off" onSubmit={onSubmit}>
            <TextField
              value={roomId}
              onChange={(e) => {
                setRoomId(parseInt(e.target.value));
              }}
              label="Enter room id"
              variant="outlined"
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton disabled={roomId === ""} onClick={onSubmit}>
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </form>
        </Grid>
        <Grid item>
          <Typography>Or</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={startNewGame}>
            Start a new game
          </Button>
        </Grid>
      </Grid>
      <Box className={classes.marginBottom}>
        <Typography variant="h5">Your Decks</Typography>
      </Box>
      <Box className={classes.marginBottom}>
        <Typography variant="h5">Games</Typography>
        <Typography variant="h6">Your Games</Typography>
        <Typography variant="h6">Available games</Typography>
      </Box>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </Container>
  );
}
