import { GridList, GridListTile, GridListTileBar } from "@material-ui/core";
import {
  Theme,
  createStyles,
  makeStyles,
  useTheme,
} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import useSWR from "swr";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
    },
    gridList: {
      cursor: "pointer",
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
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.up("md"));

  const { data: decks } = useSWR("/decks");

  return (
    <div className={classes.root}>
      <GridList
        cellHeight={420}
        spacing={8}
        cols={isMedium ? 3 : isSmall ? 2 : 1}
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
