import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { useDrop, XYCoord } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";

import CardComponent from "./CardComponent";
import { Card, Monitor, CrudGame } from "../../interfaces";
import { add, update, remove } from "../../slices/gameSlice";
import { conn } from "../../lib/peer";
import { useCardDimensions } from "../../lib/hooks";

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

  const { height } = useCardDimensions();

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

      const boundingRect = document
        .getElementById("play-zone")
        ?.getBoundingClientRect();

      if (itemType === "hand" || itemType === "deck") {
        dispatch(add(payload));

        if (conn) {
          conn.send(
            JSON.stringify({
              action: "add",
              ...payload,
              boundingRect,
              cardHeight: height,
            })
          );
        }
      } else {
        dispatch(update(payload));

        if (conn) {
          conn.send(
            JSON.stringify({
              action: "update",
              ...payload,
              boundingRect,
              cardHeight: height,
            })
          );
        }
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

  const myPlayerId = useSelector((state: any) => state.playerId);
  const isMine = myPlayerId === playerId;

  return (
    <div
      id="play-zone"
      ref={drop}
      className={clsx(classes.root, rest.className)}
    >
      {play.map((card, i) => (
        <CardComponent
          noDrag={!isMine}
          key={"play" + i}
          dropCb={(item, monitor) => {
            if (monitor.getDropResult().type !== "play") {
              const payload = {
                playerId,
                section: "play",
                card: item,
              } as CrudGame;

              dispatch(remove(payload));

              if (conn) {
                conn.send(
                  JSON.stringify({
                    action: "remove",
                    ...payload,
                  })
                );
              }
            }
          }}
          source="play"
          card={card}
        />
      ))}
    </div>
  );
}
