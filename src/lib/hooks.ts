import { Size } from "../interfaces";

export function useCardDimensions(size?: Size) {
  const width = 100;
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
