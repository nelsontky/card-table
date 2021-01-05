import React from "react";
import { CssBaseline } from "@material-ui/core";
import { Switch, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import firebase from "firebase";
import axios from "axios";

import Home from "./pages/Home";
import Game from "./pages/Game";
import { login } from "./slices/userSlice";

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        if (user) {
          user.getIdToken().then((idToken) => {
            axios.defaults.headers["Authorization"] = idToken;
          });
          
          dispatch(login(user.uid));
        }
      });

    return () => unregisterAuthObserver();
  }, [dispatch]);

  return (
    <>
      <CssBaseline />
      <Switch>
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
