import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { useDrop, XYCoord } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";

import CardComponent from "./CardComponent";
import { Card, Monitor } from "../interfaces";
import { add, update, remove } from "../slices/gameSlice";

const useStyles = makeStyles<Theme, Monitor>((theme: Theme) =>
  createStyles({
    root: ({ canDrop, isOver }) => ({
      height: "100%",
      borderStyle: canDrop ? "dashed" : "solid",
      borderColor: isOver ? "green" : "white",
    }),
  })
);

export default function PlayZone() {
  const play: Card[] = useSelector((state: any) => state.game[0].play);
  const dispatch = useDispatch();

  const [monitor, drop] = useDrop({
    accept: ["play", "hand", "deck"],
    drop: (item: Card & { type: string }, monitor) => {
      const { type, x: xRemoved, y: yRemoved, ...typeRemoved } = item;
      const itemType = monitor.getItemType();
      const { x, y } = monitor.getClientOffset() as XYCoord;

      if (itemType === "hand" || itemType === "deck") {
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

      return { type: "play" };
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
      {play.map((card, i) => (
        <CardComponent
          key={"play" + i}
          dropCb={(item, monitor) => {
            if (monitor.getDropResult().type !== "play") {
              dispatch(remove({ playerId: 0, section: "play", card: item }));
            }
          }}
          source="play"
          card={card}
        />
      ))}
    </div>
  );
}
