import React from "react";
import { Container, Grid, Typography, Button, Box } from "@material-ui/core";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";

import LoginDialog from "../components/LoginDialog";
import Decks from "../components/Decks";
import { useUser } from "../lib/hooks";
import { logout } from "../slices/userSlice";
import { useAppDispatch } from "../store";
import HomeTabs from "../components/HomeTabs";
import StartGame from "../components/StartGame";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    marginBottom: {
      marginBottom: theme.spacing(1),
    },
  })
);

export default function Home() {
  const classes = useStyles();

  const [isLogin, setIsLogin] = React.useState(false);

  const user = useUser();
  const dispatch = useAppDispatch();
  const signIn = () => {
    setIsLogin(true);
  };
  const signOut = () => {
    setIsLogin(false);
    dispatch(logout());
  };

  const [tabIndex, setTabIndex] = React.useState(0);

  return (
    <>
      <LoginDialog
        isOpen={isLogin}
        close={() => {
          setIsLogin(false);
        }}
      />
      <Container maxWidth="md" className={classes.root}>
        <Grid container justify="flex-end">
          <Grid item>
            {!user ? (
              <Button onClick={signIn} color="primary" variant="contained">
                Sign in/Sign up
              </Button>
            ) : (
              <Button onClick={signOut} color="secondary" variant="contained">
                Logout
              </Button>
            )}
          </Grid>
        </Grid>
        <HomeTabs
          value={tabIndex}
          setValue={setTabIndex}
          TabsProps={{ centered: true }}
          className={classes.marginBottom}
        />
        {tabIndex === 0 ? (
          <Box className={classes.marginBottom}>
            <Typography variant="h4" gutterBottom>
              Decks
            </Typography>
            <Decks
              openLogin={() => {
                setIsLogin(true);
              }}
            />
          </Box>
        ) : (
          <StartGame />
        )}
      </Container>
    </>
  );
}
