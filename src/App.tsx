import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import Game from "./pages/Game";

function App() {
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
