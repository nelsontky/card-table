import React from "react";
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

import Login from "../components/Login";

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
        <Typography variant="h5" gutterBottom>
          Your Decks
        </Typography>
      </Box>
      <Box className={classes.marginBottom}>
        <Typography gutterBottom variant="h5">
          Games
        </Typography>
      </Box>
      <Login />
    </Container>
  );
}
