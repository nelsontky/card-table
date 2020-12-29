import React from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";

import SendIcon from "@material-ui/icons/Send";

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

  const [roomId, setRoomId] = React.useState<number | "">("");

  const onSubmit = (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (roomId !== "") {
      console.log(roomId);
    }
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
          <Button variant="contained" color="primary">
            Start a new game
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
