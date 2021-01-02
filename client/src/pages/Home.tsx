import React from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

import { Send as SendIcon } from "@material-ui/icons";

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
