import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-ui/core";

import { logout } from "../slices/userSlice";

export default function Login() {
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.user);

  // Configure FirebaseUI.
  const uiConfig = {
    signInFlow: "redirect",
    signInSuccessUrl: "/",
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      },
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false,
    },
  };

  if (!user) {
    return (
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    );
  } else {
    return (
      <Button
        variant="contained"
        onClick={() => {
          dispatch(logout());
        }}
      >
        Logout
      </Button>
    );
  }
}
