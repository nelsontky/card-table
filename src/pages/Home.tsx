import React from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import { useHistory } from "react-router-dom";

import SendIcon from "@material-ui/icons/Send";

import { getPeer } from "../lib/peer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center",
    },
    container: {
      height: "100vh",
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
      <Grid
        container
        direction="column"
        spacing={2}
        justify="center"
        className={classes.container}
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
    </Container>
  );
}
