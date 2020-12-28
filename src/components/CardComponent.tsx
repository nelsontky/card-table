import React from "react";
import Paper from "@material-ui/core/Paper";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { useDrag } from "react-dnd";

import { ICardComponent, DragItem } from "../interfaces";
import { CARD_HEIGHT, CARD_WIDTH } from "../lib/constants";

const useStyles = makeStyles<Theme, ICardComponent>((theme: Theme) =>
  createStyles({
    root: ({ card, faceDown }) => ({
      backgroundImage: faceDown
        ? undefined
        : `url(${process.env.PUBLIC_URL}/cards/${card.cardId}.png)`,
      backgroundSize: "cover",
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      cursor: "move",
      position: card.x && card.y ? "absolute" : undefined,
      top: card.y,
      left: card.x,
    }),
  })
);

export default function CardComponent({ card, ...rest }: ICardComponent) {
  const { id, cardId, x, y, isFaceDown } = card;
  const { source, dropCb } = rest;

  const classes = useStyles({ card, ...rest });
  const [{ isDragging }, drag] = useDrag({
    item: { ...card, type: source },
    end: (item, monitor) => {
      if (dropCb && item && monitor.didDrop()) {
        dropCb(item);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return <Paper ref={drag} className={clsx(classes.root, rest.className)} />;
}
