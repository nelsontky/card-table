import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { useDrop, XYCoord } from "react-dnd";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from "react-redux";

import CardComponent from "./CardComponent";
import { Card } from "../interfaces";
import { add, update } from "../slices/yoursSlice";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "70vh",
      width: "100%",
      borderStyle: "solid",
      borderColor: "white",
    },
  })
);

export default function PlayZone() {
  const classes = useStyles();
  const play: Card[] = useSelector((state: any) => state.yours.play);
  const dispatch = useDispatch();

  const [{ canDrop, isOver }, drop] = useDrop({
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
    }),
  });

  return (
    <Grid container ref={drop} className={classes.root}>
      {play.map((card, i) => (
        <Grid item key={"hand" + i}>
          <CardComponent source="play" card={card} />
        </Grid>
      ))}
    </Grid>
  );
}
