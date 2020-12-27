import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { useDrop, XYCoord } from "react-dnd";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from "react-redux";

import CardComponent from "./CardComponent";
import { Card, Monitor } from "../interfaces";
import { add, update } from "../slices/yoursSlice";

const useStyles = makeStyles<Theme, Monitor>((theme: Theme) =>
  createStyles({
    root: {
      height: "70vh",
      width: "100%",
      borderStyle: "solid",
      borderColor: "white",
    },
    dropPreview: ({ isOver, clientOffset, card }) => ({
      backgroundImage: card
        ? `url(${process.env.PUBLIC_URL}/cards/${card.cardId}.png)`
        : undefined,
      opacity: 0.5,
      backgroundSize: "cover",
      width: "100px",
      height: "140px",
      position: "absolute",
      visibility: isOver ? "visible" : "hidden",
      top: clientOffset ? clientOffset.y : undefined,
      left: clientOffset ? clientOffset.x : undefined,
    }),
  })
);

export default function PlayZone() {
  const play: Card[] = useSelector((state: any) => state.yours.play);
  const dispatch = useDispatch();

  const [monitor, drop] = useDrop({
    accept: ["play", "hand"],
    drop: (item: Card & { type: string }, monitor) => {
      const { type, x: xRemoved, y: yRemoved, ...typeRemoved } = item;
      const itemType = monitor.getItemType();
      const { x, y } = monitor.getClientOffset() as XYCoord;

      if (itemType === "hand") {
        dispatch(add({ section: "play", card: { ...typeRemoved, x, y } }));
      } else {
        dispatch(update({ section: "play", card: { ...typeRemoved, x, y } }));
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
