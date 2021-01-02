import { configureStore } from "@reduxjs/toolkit";
import playerIdReducer from "./slices/playerIdSlice";
import gameReducer from "./slices/gameSlice";
import userReducer from "./slices/userSlice";

export default configureStore({
  reducer: {
    playerId: playerIdReducer,
    game: gameReducer,
    user: userReducer,
  },
});
