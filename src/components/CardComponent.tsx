import React from "react";
import Paper from "@material-ui/core/Paper";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { useDrag } from "react-dnd";

import { ICardComponent } from "../interfaces";

const useStyles = makeStyles<Theme, { cardId: string; faceDown?: boolean }>(
  (theme: Theme) =>
    createStyles({
      root: {
        backgroundImage: ({ cardId, faceDown }) =>
          faceDown
            ? undefined
            : `url(${process.env.PUBLIC_URL}/cards/${cardId}.png)`,
        backgroundSize: "cover",
        width: "100px",
        height: "140px",
        cursor: "move",
      },
    })
);

export default function CardComponent({ card, ...rest }: ICardComponent) {
  const { id, cardId, x, y } = card;
  const { source, faceDown, dropCb } = rest;

  const classes = useStyles({ cardId, faceDown });
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

  return (
    <Paper
      ref={drag}
      className={clsx(classes.root, rest.className)}
      style={{ top: y, left: x, position: y ? "absolute" : undefined }}
    />
  );
}
