import React from "react";
import {
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
      marginTop: theme.spacing(5),
      textAlign: "center",
    },
  })
);

export default function StartGame() {
  const history = useHistory();
  const classes = useStyles();
  const [roomId, setRoomId] = React.useState<number | "">("");
  const startNewGame = () => {
    const peerId = Math.floor(Math.random() * 10000) + "";
    history.push({
      pathname: `/${peerId}`,
      // search: `?deck=${selected}`,
      state: { isHost: true },
    });
  };
  const onSubmit = (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (roomId !== "") {
      history.push(`/${roomId}`);
    }
  };

  return (
    <Grid container direction="column" spacing={2} className={classes.root}>
      <Grid item>
        <form noValidate autoComplete="off" onSubmit={onSubmit}>
          <TextField
            value={roomId}
            onChange={(e) => {
              setRoomId(parseInt(e.target.value));
            }}
            label="Enter room id to join"
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
  );
}
