import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import {
  Box,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  TextField,
  Typography,
  Button,
} from "@material-ui/core";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Search as SearchIcon, Delete as DeleteIcon } from "@material-ui/icons";
import useSWR from "swr";

import { useUser } from "../../lib/hooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    searchArea: {
      height: "calc(100vh - 56px)",
    },
    searchRoot: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: "100%",
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
    maxWidth: {
      width: "100%",
    },
    inline: {
      display: "inline",
    },
    marginBottom: {
      marginBottom: theme.spacing(1),
    },
  })
);

export default function Create() {
  const classes = useStyles();

  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<{ [id: string]: any }>({});
  const [clicked, setClicked] = React.useState<string | null>(null);

  return (
    <Container fixed className={classes.root}>
      <Grid container spacing={1}>
        <Grid className={classes.searchArea} item xs={12} md={4}>
          <SearchBar onSearch={setSearch} />
          <React.Suspense
            fallback={
              <Box textAlign="center" marginTop={2}>
                <CircularProgress />
              </Box>
            }
          >
            <SearchResults
              setClicked={setClicked}
              query={search}
              selected={selected}
              setSelected={setSelected}
            />
          </React.Suspense>
        </Grid>
        <Grid item xs={12} md={5}>
          <Selected
            setClicked={setClicked}
            cards={selected}
            setCards={setSelected}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          {clicked && (
            <img
              src={`${process.env.REACT_APP_S3_HOST}${clicked}.png`}
              alt={clicked}
              className={classes.maxWidth}
            />
          )}
          <form>
            <TextField
              fullWidth
              label="Deck name"
              variant="filled"
              className={classes.marginBottom}
            />
            <Button color="primary" variant="contained">
              Create Deck
            </Button>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
}

function Selected({
  cards,
  setClicked,
  setCards,
}: {
  cards: any;
  setClicked: (id: string) => void;
  setCards: (cards: any) => void;
}) {
  const classes = useStyles();
  const allCards = Object.keys(cards).map((id) => ({ id, ...cards[id] }));

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Selected
      </Typography>
      {!allCards?.length || allCards.length === 0 ? (
        <Box textAlign="center" marginTop={2}>
          <Typography variant="caption">
            No cards selected yet. Search for cards to add!
          </Typography>
        </Box>
      ) : (
        <List className={classes.maxWidth}>
          {allCards.map((card) => (
            <React.Fragment key={card.id}>
              <ListItem
                button
                disableRipple
                onClick={() => {
                  setClicked(card.id);
                }}
                alignItems="flex-start"
                component={Grid}
                container
                spacing={1}
              >
                <Grid item xs={2}>
                  <TextField
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={cards[card.id].quantity}
                    onChange={(e) => {
                      const { value } = e.target;
                      if (+value > 0) {
                        setCards({
                          ...cards,
                          [card.id]: {
                            ...cards[card.id],
                            quantity: value,
                          },
                        });
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={10}>
                  <ListItemText primary={card.name} />
                </Grid>
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => {
                      let cardsCopy = { ...cards };
                      delete cardsCopy[card.id];
                      setCards(cardsCopy);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant="middle" component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </>
  );
}

function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const classes = useStyles();

  const [query, setQuery] = React.useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <Paper component="form" className={classes.searchRoot} onSubmit={onSubmit}>
      <InputBase
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        className={classes.input}
        placeholder="Card Search"
      />
      <IconButton type="submit" className={classes.iconButton}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

function renderRow(props: ListChildComponentProps) {
  const { index, style, data } = props;
  const { results, setSelected, setClicked } = data;
  const card = results[index];

  return (
    <ListItem
      onClick={() => {
        setClicked(card.id);
        setSelected((selected: any) => ({
          ...selected,
          [card.id]: { name: card.name, quantity: 1 },
        }));
      }}
      button
      style={style}
      key={card.name + index}
    >
      <ListItemText primary={card.name} />
    </ListItem>
  );
}

function SearchResults({
  query,
  selected,
  setSelected,
  setClicked,
}: {
  query: string;
  selected: { [id: string]: any };
  setSelected: (selected: { [id: string]: any }) => void;
  setClicked: (id: string) => void;
}) {
  const user = useUser({ redirectTo: "/" });
  const { data } = useSWR(user ? `/cards/search?query=${query}` : null);

  if (!data?.length || data.length === 0) {
    return (
      <Box textAlign="center" marginTop={2}>
        <Typography variant="caption">No results found</Typography>
      </Box>
    );
  }

  const selectedRemoved = data.filter((card: any) => !selected[card.id]);
  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          className="List"
          height={height}
          itemSize={48}
          itemCount={selectedRemoved.length}
          width={width}
          itemData={{ results: selectedRemoved, setSelected, setClicked }}
        >
          {renderRow}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
}
