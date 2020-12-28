import React from "react";
import Paper from "@material-ui/core/Paper";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { useDrag, XYCoord } from "react-dnd";

import CardMenu from "./CardMenu";
import { ICardComponent, DragItem } from "../interfaces";
import { useCardDimensions } from "../lib/hooks";
import ClosableBackdrop from "./ClosableBackdrop";

const useStyles = makeStyles<
  Theme,
  ICardComponent & {
    width: string;
    height: string;
    isDragging: boolean;
    clientOffset: XYCoord;
  }
>((theme: Theme) =>
  createStyles({
    root: ({ card, width, height }) => ({
      backgroundImage: card.isFaceDown
        ? undefined
        : `url(${process.env.PUBLIC_URL}/cards/${card.cardId}.png)`,
      backgroundSize: "cover",
      width,
      height,
      cursor: "move",
      position: card.x && card.y ? "absolute" : "relative",
      top: card.y,
      left: card.x,
      transform: `rotate(${card.angle}deg)`,
    }),
    dropPreview: ({ isDragging, clientOffset, width, height, card }) => ({
      backgroundImage: card.isFaceDown
        ? undefined
        : `url(${process.env.PUBLIC_URL}/cards/${card.cardId}.png)`,
      backgroundSize: "cover",
      width,
      height,
      opacity: 0.5,
      visibility: isDragging ? "visible" : "hidden",
      position: "absolute",
      top: clientOffset ? clientOffset.y : undefined,
      left: clientOffset ? clientOffset.x : undefined,
      transform: `rotate(${card.angle}deg)`,
    }),
    menu: {
      position: "absolute",
      top: 0,
      right: 0,
    },
    view: ({ card }) => ({
      transform: `rotate(${card.angle}deg)`,
    }),
  })
);

export default function CardComponent({ card, ...rest }: ICardComponent) {
  const { source, dropCb, noDrag, disableActions } = rest;
  const { width, height } = useCardDimensions();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isView, setIsView] = React.useState(false);

  const [{ isDragging, clientOffset }, drag] = useDrag({
    item: { ...card, type: source },
    end: (item, monitor) => {
      if (dropCb && item && monitor.didDrop()) {
        dropCb(item, monitor);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      clientOffset: monitor.getClientOffset() as XYCoord,
    }),
  });

  const classes = useStyles({
    card,
    width,
    height,
    isDragging,
    clientOffset,
    ...rest,
  });

  return (
    <>
      <ClosableBackdrop
        isOpen={isView}
        close={() => {
          setIsView(false);
        }}
      >
        <img
          className={classes.view}
          src={`${process.env.PUBLIC_URL}/cards/${card.cardId}.png`}
          alt={card.cardId}
        />
      </ClosableBackdrop>
      <Paper className={classes.dropPreview} />
      <Paper
        onClick={() => {
          if (!card.isFaceDown) {
            setIsView(true);
          }
        }}
        ref={noDrag ? undefined : drag}
        className={clsx(classes.root, rest.className)}
      >
        {!disableActions && (
          <CardMenu
            className={classes.menu}
            card={card}
            isOpen={isMenuOpen}
            setIsOpen={setIsMenuOpen}
          />
        )}
      </Paper>
    </>
  );
}
