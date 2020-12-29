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

  const [dimensions, setDimensions] = React.useState({
    height: -1,
    width: -1,
    offsetTop: -1,
    offsetLeft: -1,
  });
  React.useEffect(() => {
    const playZone = document.getElementById("play-zone");
    if (playZone) {
      setDimensions({
        height: playZone.clientHeight,
        width: playZone.clientWidth,
        offsetTop: playZone.offsetTop,
        offsetLeft: playZone.offsetLeft,
      });
    }
  }, []);

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
              ...dimensions,
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
              ...dimensions,
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
      <div
        id="play-zone"
        ref={drop}
        className={clsx(classes.root, rest.className)}
      >
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
