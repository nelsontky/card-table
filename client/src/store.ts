import { configureStore } from "@reduxjs/toolkit";
import playerIdReducer from "./slices/playerIdSlice";
import gameReducer from "./slices/gameSlice";
import userReducer from "./slices/userSlice";
import { useDispatch } from "react-redux";

const store = configureStore({
  reducer: {
    playerId: playerIdReducer,
    game: gameReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
