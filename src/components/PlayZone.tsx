import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { useDrop, XYCoord } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";

import CardComponent from "./CardComponent";
import { Card, Monitor, CrudGame } from "../interfaces";
import { add, update, remove } from "../slices/gameSlice";
import { getConn } from "../lib/peer";

const useStyles = makeStyles<Theme, Monitor>((theme: Theme) =>
  createStyles({
    root: ({ canDrop, isOver }) => ({
      height: "100%",
      borderStyle: canDrop ? "dashed" : "solid",
      borderColor: isOver ? "green" : "white",
    }),
  })
);

export default function PlayZone({
  playerId,
  ...rest
}: {
  playerId: number;
  [x: string]: any;
}) {
  const play: Card[] = useSelector((state: any) => {
    let result: Card[] = [];
    for (let player of state.game) {
      result = [...result, ...player.play];
    }
    return result;
  });
  const dispatch = useDispatch();

  const [monitor, drop] = useDrop({
    accept: ["play", "hand", "deck"],
    drop: (item: Card & { type: string }, monitor) => {
      const { type, x: xRemoved, y: yRemoved, ...typeRemoved } = item;
      const itemType = monitor.getItemType();
      const { x, y } = monitor.getClientOffset() as XYCoord;
      const payload = {
        playerId,
        section: "play",
        card: { ...typeRemoved, x, y },
      } as CrudGame;

      if (itemType === "hand" || itemType === "deck") {
        dispatch(add(payload));

        getConn().then((conn) => {
          conn.send(
            JSON.stringify({
              action: "add",
              ...payload,
            })
          );
        });
      } else {
        dispatch(update(payload));

        getConn().then((conn) => {
          conn.send(
            JSON.stringify({
              action: "update",
              ...payload,
            })
          );
        });
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
    <>
      <Typography variant="caption">Play area</Typography>
      <div ref={drop} className={clsx(classes.root, rest.className)}>
        {play.map((card, i) => (
          <CardComponent
            key={"play" + i}
            dropCb={(item, monitor) => {
              if (monitor.getDropResult().type !== "play") {
                const payload = {
                  playerId,
                  section: "play",
                  card: item,
                } as CrudGame;

                dispatch(remove(payload));

                getConn().then((conn) => {
                  conn.send(
                    JSON.stringify({
                      action: "remove",
                      ...payload,
                    })
                  );
                });
              }
            }}
            source="play"
            card={card}
          />
        ))}
      </div>
    </>
  );
}
