import React from "react";
import { Paper } from "@material-ui/core";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { useDrag, XYCoord } from "react-dnd";

import CardMenu from "./CardMenu";
import { ICardComponent } from "../interfaces";
import { useSelector } from "react-redux";
import { useCardDimensions } from "../lib/hooks";
import ClosableBackdrop from "./ClosableBackdrop";

const useStyles = makeStyles<
  Theme,
  ICardComponent & {
    width: number;
    height: number;
    isDragging: boolean;
    clientOffset: XYCoord;
  }
>((theme: Theme) =>
  createStyles({
    root: ({ card, width, height, hide, isMine, noDrag }) => ({
      backgroundImage:
        card.isFaceDown || hide
          ? undefined
          : `url(${process.env.REACT_APP_S3_HOST}${card.cardId}.png)`,
      backgroundSize: "cover",
      width,
      height,
      cursor: isMine && !noDrag ? "move" : undefined,
      position: card.x && card.y ? "absolute" : "relative",
      top: card.y,
      left: card.x,
      transform: `rotate(${card.angle}deg)`,
    }),
    dropPreview: ({ isDragging, clientOffset, width, height, card }) => ({
      backgroundImage: card.isFaceDown
        ? undefined
        : `url(${process.env.REACT_APP_S3_HOST}${card.cardId}.png)`,
      backgroundSize: "cover",
      width,
      height,
      opacity: 0.5,
      visibility: isDragging ? "visible" : "hidden",
      position: "absolute",
      top: clientOffset ? clientOffset.y : undefined,
      left: clientOffset ? clientOffset.x : undefined,
      transform: `rotate(${card.angle}deg)`,
      zIndex: 1,
    }),
    menu: {
      position: "absolute",
      top: 0,
      right: 0,
    },
    view: ({ card }) => ({
      // TODO decide whether to support preview rotate
      // transform: `rotate(${card.angle}deg)`,
    }),
  })
);

export default function CardComponent({ card, ...rest }: ICardComponent) {
  const { source, dropCb, disableActions, size, noDrag } = rest;
  const { width, height } = useCardDimensions(size);
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

  const playerId = useSelector((state: any) => state.playerId);
  const isMine = playerId === card.ownerId;

  const classes = useStyles({
    card,
    width,
    height,
    isDragging,
    clientOffset,
    isMine,
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
          src={`${process.env.REACT_APP_S3_HOST}${card.cardId}.png`}
          alt={card.cardId}
        />
      </ClosableBackdrop>
      <Paper className={classes.dropPreview} />
      <Paper
        onClick={() => {
          if (!card.isFaceDown && !rest.hide) {
            setIsView(true);
          }
        }}
        ref={!isMine || noDrag ? undefined : drag}
        className={clsx(classes.root, rest.className)}
      >
        {!disableActions && isMine && (
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
