import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { useDrop, useDrag } from "react-dnd";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from "react-redux";

import CardComponent from "./CardComponent";
import { Card } from "../interfaces";
import { add, remove } from "../slices/yoursSlice";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      width: "100%",
      borderStyle: "solid",
      borderColor: "white",
    },
  })
);

export default function HandZone() {
  const classes = useStyles();
  const hand: Card[] = useSelector((state: any) => state.yours.hand);
  const dispatch = useDispatch();

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "deck",
    drop: (item: Card & { type: string }) => {
      const { type, x, y, ...typeRemoved } = item;
      dispatch(add({ section: "hand", card: typeRemoved }));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <Grid container ref={drop} className={classes.root}>
      {hand.map((card, i) => (
        <Grid item key={"hand" + i}>
          <CardComponent
            dropCb={() => {
              dispatch(remove({ section: "hand", id: card.id }));
            }}
            source="hand"
            card={card}
          />
        </Grid>
      ))}
    </Grid>
  );
}
