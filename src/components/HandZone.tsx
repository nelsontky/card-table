import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { useDrop } from "react-dnd";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from "react-redux";

import CardComponent from "./CardComponent";
import { Card, Monitor } from "../interfaces";
import { add, remove } from "../slices/gameSlice";

const useStyles = makeStyles<Theme, Monitor>((theme: Theme) =>
  createStyles({
    root: ({ canDrop, isOver }) => ({
      height: "100%",
      borderStyle: canDrop ? "dashed" : "solid",
      borderColor: isOver ? "green" : "white",
      overflowX: "scroll",
    }),
  })
);

export default function HandZone({ playerId }: { playerId: number }) {
  const hand: Card[] = useSelector((state: any) => state.game[playerId].hand);
  const dispatch = useDispatch();

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ["deck", "play"],
    drop: (item: Card & { type: string }) => {
      const { type, x, y, ...typeRemoved } = item;
      dispatch(
        add({
          playerId,
          section: "hand",
          card: { ...typeRemoved, isFaceDown: false },
        })
      );
      return { type: "hand" };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const classes = useStyles({ canDrop, isOver });

  return (
    <Grid container ref={drop} className={classes.root} wrap="nowrap">
      {hand.map((card, i) => (
        <Grid item key={"hand" + i}>
          <CardComponent
            dropCb={() => {
              dispatch(remove({ playerId, section: "hand", card }));
            }}
            source="hand"
            card={card}
          />
        </Grid>
      ))}
    </Grid>
  );
}
