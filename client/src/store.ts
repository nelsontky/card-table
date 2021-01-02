import { configureStore } from "@reduxjs/toolkit";
import playerIdReducer from "./slices/playerIdSlice";
import gameReducer from "./slices/gameSlice";

export default configureStore({
  reducer: {
    playerId: playerIdReducer,
    game: gameReducer,
  },
});
