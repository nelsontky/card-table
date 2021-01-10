import React from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

import { Send as SendIcon } from "@material-ui/icons";
import Decks from "./Decks";
import ClosableDialog from "../ClosableDialog";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(5),
      textAlign: "center",
    },
  })
);

export default function StartGame({ openLogin }: { openLogin: () => void }) {
  const history = useHistory();
  const classes = useStyles();
  const [roomId, setRoomId] = React.useState<number | "">("");
  const [peerId, setPeerId] = React.useState<string | "">("");
  const [isChooseDeck, setIsChooseDeck] = React.useState(false);
  const startNewGame = () => {
    const peerId = Math.floor(Math.random() * 10000) + "";
    setPeerId(peerId);
    setIsChooseDeck(true);
  };
  const onSubmit = (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (roomId !== "") {
      setIsChooseDeck(true);
    }
  };

  return (
    <>
      <ClosableDialog
        isOpen={isChooseDeck}
        close={() => {
          setPeerId("");
          setIsChooseDeck(false);
        }}
      >
        <DialogTitle>Choose a deck</DialogTitle>
        <DialogContent>
          <Decks
            linkTo={(id: string) => ({
              pathname: `/${peerId.length > 0 ? peerId : roomId}`,
              search: `?deck=${id}`,
              state: { isHost: peerId.length > 0 },
            })}
            openLogin={openLogin}
          />
        </DialogContent>
      </ClosableDialog>
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
    </>
  );
}
