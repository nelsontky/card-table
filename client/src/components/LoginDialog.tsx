import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase";
import { useSelector } from "react-redux";
import { Typography, DialogContent, Box } from "@material-ui/core";

import ClosableDialog, { IClosableDialog } from "./ClosableDialog";
import { RootState } from "../store";

export default function Login(props: IClosableDialog) {
  const user = useSelector((state: RootState) => state.user);

  // Configure FirebaseUI.
  const uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false,
    },
  };

  if (!user) {
    return (
      <ClosableDialog {...props}>
        <DialogContent>
          <Box marginBottom={1} textAlign="center">
            <Typography>Sign in to continue</Typography>
          </Box>
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </DialogContent>
      </ClosableDialog>
    );
  }

  return null;
}
