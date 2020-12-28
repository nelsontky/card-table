import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { useDrop, XYCoord } from "react-dnd";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from "react-redux";

import CardComponent from "./CardComponent";
import { Card, Monitor } from "../interfaces";
import { add, update } from "../slices/gameSlice";
import { CARD_HEIGHT, CARD_WIDTH } from "../lib/constants";

const useStyles = makeStyles<Theme, Monitor>((theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      borderStyle: "solid",
      borderColor: "white",
    },
    dropPreview: ({ isOver, clientOffset, card }) => ({
      backgroundImage: card
        ? `url(${process.env.PUBLIC_URL}/cards/${card.cardId}.png)`
        : undefined,
      opacity: 0.5,
      backgroundSize: "cover",
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      position: "absolute",
      visibility: isOver ? "visible" : "hidden",
      top: clientOffset ? clientOffset.y : undefined,
      left: clientOffset ? clientOffset.x : undefined,
    }),
  })
);

export default function PlayZone() {
  const play: Card[] = useSelector((state: any) => state.game[0].play);
  const dispatch = useDispatch();

  const [monitor, drop] = useDrop({
    accept: ["play", "hand"],
    drop: (item: Card & { type: string }, monitor) => {
      const { type, x: xRemoved, y: yRemoved, ...typeRemoved } = item;
      const itemType = monitor.getItemType();
      const { x, y } = monitor.getClientOffset() as XYCoord;

      if (itemType === "hand") {
        dispatch(
          add({ playerId: 0, section: "play", card: { ...typeRemoved, x, y } })
        );
      } else {
        dispatch(
          update({
            playerId: 0,
            section: "play",
            card: { ...typeRemoved, x, y },
          })
        );
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      clientOffset: monitor.getClientOffset(),
      card: monitor.getItem(),
    }),
  });

  const classes = useStyles(monitor);

  return (
    <div ref={drop} className={classes.root}>
      <div className={classes.dropPreview} />
      {play.map((card, i) => (
        <Grid item key={"hand" + i}>
          <CardComponent source="play" card={card} />
        </Grid>
      ))}
    </div>
  );
}
