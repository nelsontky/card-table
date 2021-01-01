import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Typography } from "@material-ui/core";
import shuffle from "lodash/shuffle";
import { useDrop } from "react-dnd";
import clsx from "clsx";

import { Card, CrudGame, Monitor } from "../interfaces";
import CardComponent from "../components/CardComponent";
import { set, remove, add } from "../slices/gameSlice";
import { createDeck } from "../lib/utils";
import BrowseDeck from "./BrowseDeck";
import { getConn } from "../lib/peer";

const buttons = ["Shuffle", "Browse"];

const useStyles = makeStyles<Theme, Monitor>((theme: Theme) =>
  createStyles({
    root: ({ canDrop, isOver, isMine }) => ({
      width: "100%",
      height: "100%",
      borderStyle: canDrop && isMine ? "dashed" : "solid",
      borderColor: isOver ? "green" : "white",
      padding: theme.spacing(1),
    }),
  })
);

export default function DeckZone({
  playerId,
  ...rest
}: {
  playerId: number;
  [x: string]: any;
}) {
  const dispatch = useDispatch();
  const deck: Card[] = useSelector((state: any) => state.game[playerId].deck);

  const myPlayerId = useSelector((state: any) => state.playerId);
  const isMine = myPlayerId === playerId;

  const [isBrowseDeck, setIsBrowseDeck] = React.useState(false);

  const handleClick = (button: string) => {
    switch (button) {
      case "Shuffle":
        dispatch(set({ playerId, section: "deck", cards: shuffle(deck) }));
        break;
      case "Browse":
        setIsBrowseDeck(true);
        break;
      default:
      // TODO throw error here
    }
  };

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ["hand", "play"],
    drop: (item: Card & { type: string }) => {
      const { type, x, y, ...typeRemoved } = item;
      const payload = {
        playerId,
        section: "deck",
        addToFront: true,
        card: { ...typeRemoved, isFaceDown: true, angle: 0 },
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
      return { type: "deck" };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const classes = useStyles({ canDrop, isOver, isMine });

  React.useEffect(() => {
    dispatch(
      set({
        playerId,
        section: "deck",
        cards: createDeck({
          deckName: myPlayerId === 0 ? "dragonicForce" : "ninjaOnslaught",
          ownerId: playerId,
        }),
      })
    );
  }, [dispatch, playerId, myPlayerId]);

  if (deck.length <= 0) {
    return null;
  }

  return (
    <>
      <BrowseDeck isOpen={isBrowseDeck} setIsOpen={setIsBrowseDeck} />
      <Grid ref={drop} container className={clsx(classes.root, rest.className)}>
        <Grid item md={3} xs={12}>
          <CardComponent
            size={rest.size}
            noDrag={!isMine}
            disableActions
            dropCb={() => {
              dispatch(remove({ playerId, section: "deck", card: deck[0] }));
            }}
            source={"deck"}
            card={deck[0]}
          />
        </Grid>
        {isMine && (
          <Grid item container md={9} xs={12} direction="column">
            {buttons.map((button, i) => (
              <Grid key={"deck-button" + i} item>
                <Button onClick={() => handleClick(button)}>{button}</Button>
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </>
  );
}
