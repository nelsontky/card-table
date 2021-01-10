import React from "react";
import { CssBaseline } from "@material-ui/core";
import { Switch, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import firebase from "firebase";
import axios from "axios";

import Home from "./pages/Home";
import Game from "./pages/Game";
import { login } from "./slices/userSlice";
import ManageDeck from "./pages/decks/ManageDeck";
import Snackbars from "./components/Snackbars";

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        if (user) {
          axios.interceptors.request.use(async (config) => {
            const idToken = await user.getIdToken();
            console.log(idToken);
            return { ...config, headers: { Authorization: idToken } };
          });

          dispatch(login(user.uid));
        }
      });

    return () => unregisterAuthObserver();
  }, [dispatch]);

  return (
    <>
      <CssBaseline />
      <Snackbars />
      <Switch>
        <Route path="/decks/create">
          <ManageDeck />
        </Route>
        <Route path="/decks/:id">
          <ManageDeck />
        </Route>
        <Route path="/:id">
          <Game />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </>
  );
}

export default App;
