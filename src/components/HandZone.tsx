import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { useDrop } from "react-dnd";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";

import CardComponent from "./CardComponent";
import { Card, Monitor, IHandZone, CrudGame } from "../interfaces";
import { add, remove } from "../slices/gameSlice";
import { getConn } from "../lib/peer";

const useStyles = makeStyles<Theme, Monitor>((theme: Theme) =>
  createStyles({
    root: ({ canDrop, isOver }) => ({
      width: "100%",
      borderStyle: canDrop ? "dashed" : "solid",
      borderColor: isOver ? "green" : "white",
      overflowX: "scroll",
    }),
  })
);

export default function HandZone({ playerId, size, ...rest }: IHandZone) {
  const hand: Card[] = useSelector((state: any) => state.game[playerId].hand);
  const dispatch = useDispatch();

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ["deck", "play"],
    drop: (item: Card & { type: string }) => {
      const { type, x, y, ...typeRemoved } = item;
      const payload = {
        playerId,
        section: "hand",
        card: { ...typeRemoved, isFaceDown: false },
      } as CrudGame;

      dispatch(add(payload));

      getConn().then((conn) => {
        conn.send(
          JSON.stringify({
            action: "add",
            ...payload,
          })
        );
      });
      return { type: "hand" };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const classes = useStyles({ canDrop, isOver });

  return (
    <>
      <Typography variant="caption">Hand</Typography>
      <Grid
        container
        wrap="nowrap"
        ref={drop}
        className={clsx(classes.root, rest.className)}
      >
        {hand.map((card, i) => (
          <Grid item key={"hand" + i}>
            <CardComponent
              size={size}
              disableActions={playerId !== 0}
              dropCb={() => {
                const payload = { playerId, section: "hand", card } as CrudGame;
                dispatch(remove(payload));

                getConn().then((conn) => {
                  conn.send(
                    JSON.stringify({
                      action: "remove",
                      ...payload,
                    })
                  );
                });
              }}
              source="hand"
              card={card}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
