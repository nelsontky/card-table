import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  createMuiTheme,
  ThemeProvider,
  responsiveFontSizes,
} from "@material-ui/core/styles";
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider } from "react-dnd";
import store from "./store";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

let theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});
theme = responsiveFontSizes(theme);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
        <Provider store={store}>
          <Router>
            <App />
          </Router>
        </Provider>
      </DndProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
