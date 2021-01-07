import React from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { Size } from "../interfaces";

export function useCardDimensions(size?: Size) {
  const theme = useTheme();

  const isMed = useMediaQuery(theme.breakpoints.up("md"));
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const isXl = useMediaQuery(theme.breakpoints.up("xl"));

  const width = isXl ? 75 : isLarge ? 50 : isMed ? 40 : 30;
  const height = width * 1.4;

  switch (size) {
    case "small":
      return { height: height / 2, width: width / 2 };
    case "large":
      return { height: height * 2, width: width * 2 };
    default:
      return { height: height, width: width };
  }
}

export interface IUseUser {
  redirectTo?: string;
  redirectIfFound: string;
}

export function useUser({ redirectTo, redirectIfFound }: IUseUser) {
  const user = useSelector((state: any) => state.user);
  const hasUser = Boolean(user);
  const history = useHistory();

  React.useEffect(() => {
    if (!redirectTo) {
      return;
    }
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser)
    ) {
      history.push(redirectTo);
    }
  }, [redirectTo, redirectIfFound, hasUser]);

  return user;
}
