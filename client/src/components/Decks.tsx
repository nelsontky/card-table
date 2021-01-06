import { GridList, GridListTile, GridListTileBar } from "@material-ui/core";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";

import useSWR from "swr";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      cursor: "pointer",
      flexWrap: "nowrap",
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: "translateZ(0)",
    },
    notSelected: {
      opacity: 0.5,
    },
    title: {
      color: theme.palette.primary.light,
    },
    titleBar: {
      background:
        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
    },
  })
);

export default function Decks({
  selected,
  setSelected,
  ...rest
}: {
  selected: any;
  setSelected: (selected: any) => void;
  [a: string]: any;
}) {
  const classes = useStyles();

  const { data: decks } = useSWR("/decks");

  return (
    <div className={classes.root}>
      <GridList
        cellHeight={420}
        spacing={8}
        cols={2.5}
        className={classes.gridList}
      >
        {decks.map((deck: any) => (
          <GridListTile
            key={deck.id}
            onClick={() => {
              if (selected === deck.id) {
                setSelected(null);
              } else {
                setSelected(deck.id);
              }
            }}
            className={
              selected && selected !== deck.id ? classes.notSelected : undefined
            }
          >
            <img
              src={
                process.env.REACT_APP_S3_HOST +
                deck.cardQuantities[0].card.id +
                ".png"
              }
              alt={deck.name}
            />
            <GridListTileBar title={deck.name} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
