import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SnackBarMessageNoKey {
  severity: "error" | "warning" | "info" | "success";
  message: string;
}
export type SnackbarMessage = SnackBarMessageNoKey & { key: number };
export interface SnackbarsState {
  open: boolean;
  snackPack: SnackbarMessage[];
  currentMessage?: SnackbarMessage;
}

export const slice = createSlice({
  name: "snackbars",
  initialState: { open: false, snackPack: [] } as SnackbarsState,
  reducers: {
    alert: (state, action: PayloadAction<SnackBarMessageNoKey>) => {
      return {
        ...state,
        snackPack: [
          ...state.snackPack,
          { ...action.payload, key: new Date().getTime() },
        ],
      };
    },
    setSnackPack: (state, action: PayloadAction<SnackbarMessage[]>) => {
      return { ...state, snackPack: action.payload };
    },
    setCurrentMessage: (
      state,
      action: PayloadAction<SnackbarMessage | undefined>
    ) => {
      return { ...state, currentMessage: action.payload };
    },
    setOpen: (state, action: PayloadAction<boolean>) => {
      return { ...state, open: action.payload };
    },
  },
});

export const { alert, setSnackPack, setCurrentMessage, setOpen } = slice.actions;

export default slice.reducer;
