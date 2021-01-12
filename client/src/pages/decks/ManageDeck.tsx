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
import clsx from "clsx";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";

import { useUser } from "../../lib/hooks";
import { useAppDispatch } from "../../store";
import { alert } from "../../slices/snackbarsSlice";
import { getFileUrl } from "../../lib/utils";

import LoadingBackdrop from "../../components/LoadingBackdrop";

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
    selectedError: {
      borderStyle: "solid",
      borderColor: theme.palette.error.main,
    },
    errorText: {
      color: theme.palette.error.main,
    },
  })
);

export default function ManageDeckWrapper() {
  return (
    <React.Suspense fallback={<LoadingBackdrop />}>
      <ManageDeck />
    </React.Suspense>
  );
}

function ManageDeck() {
  const user = useUser();
  const { id: deckId } = useParams<any>();
  const { data } = useSWR(deckId ? `/decks/${deckId}` : null);
  const isEdit = !!data;
  const canEdit = !data || data.createdBy === user;

  const classes = useStyles();
  const history = useHistory();

  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<{ [id: string]: any }>({});
  const [name, setName] = React.useState("");
  const [clicked, setClicked] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<{ [x: string]: string }>({});

  React.useEffect(() => {
    if (data) {
      let selected: any = {};
      for (const card of data.cardQuantities) {
        selected[card.card.id] = {
          quantity: card.quantity,
          name: card.card.name,
        };
      }
      setSelected(selected);

      setName(data.name);
    }
  }, [data]);

  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useAppDispatch();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEmpty = Object.keys(selected).length === 0;
    const hasName = name.trim().length > 0;

    let newErrors: any = {};
    if (isEmpty) {
      newErrors.selected =
        "Please select at least one card to add to your deck!";
    }
    if (!hasName) {
      newErrors.name = "Please input a deck name";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      dispatch(alert({ message: "An error has occurred!", severity: "error" }));
      return;
    }

    const cards: any = Object.keys(selected).map((id) => ({
      id,
      quantity: selected[id].quantity,
    }));
    try {
      setIsLoading(true);
      if (isEdit) {
        await axios.put(`/decks/${data.id}`, { name, cards });
      } else {
        await axios.post("/decks", { name, cards });
      }
      history.push("/");
    } catch (err) {
      dispatch(alert({ message: "An error has occurred!", severity: "error" }));
      setIsLoading(false);
      setErrors(err.response.data);
    }
  };

  const onDelete = async () => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this deck?"
      );

      if (confirm) {
        setIsLoading(true);
        await axios.delete(`/decks/${data.id}`);
        history.push("/");
      }
    } catch (err) {
      dispatch(alert({ message: "An error has occurred!", severity: "error" }));
      setIsLoading(false);
      setErrors(err.response.data);
    }
  };

  return (
    <>
      {isLoading && <LoadingBackdrop />}
      <Container fixed className={classes.root}>
        <Grid container spacing={1}>
          {canEdit && (
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
                  setErrors={setErrors}
                />
              </React.Suspense>
            </Grid>
          )}
          <Grid item xs={12} md={5}>
            <Selected
              canEdit={canEdit}
              setClicked={setClicked}
              cards={selected}
              setCards={setSelected}
              className={clsx(errors.selected && classes.selectedError)}
            />
            {errors.selected && (
              <Typography className={classes.errorText} variant="caption">
                {errors.selected}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={3}>
            {clicked && (
              <img
                src={getFileUrl(`${clicked}.png`)}
                alt={clicked}
                className={classes.maxWidth}
              />
            )}
            <form onSubmit={onSubmit}>
              <TextField
                fullWidth
                label="Deck name"
                variant="filled"
                className={classes.marginBottom}
                value={name}
                error={!!errors.name}
                helperText={errors.name ? errors.name : undefined}
                onChange={(e) => {
                  setErrors({});
                  setName(e.target.value);
                }}
                disabled={!canEdit}
              />
              <Grid container spacing={1}>
                <Grid item>
                  {canEdit && (
                    <Button color="primary" variant="contained" type="submit">
                      {isEdit ? "Update Deck" : "Create Deck"}
                    </Button>
                  )}
                </Grid>
                <Grid item>
                  {canEdit && isEdit && (
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={onDelete}
                    >
                      Delete Deck
                    </Button>
                  )}
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

function Selected({
  cards,
  setClicked,
  setCards,
  canEdit,
  ...rest
}: {
  cards: any;
  setClicked: (id: string) => void;
  setCards: (cards: any) => void;
  canEdit: boolean;
  [x: string]: any;
}) {
  const classes = useStyles();
  const allCards = Object.keys(cards).map((id) => ({ id, ...cards[id] }));

  return (
    <div className={rest.className}>
      <Typography variant="h6" gutterBottom>
        {canEdit ? "Selected" : "Cards in deck"}
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
                    disabled={!canEdit}
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
                {canEdit && (
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
                )}
              </ListItem>
              <Divider variant="middle" component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </div>
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
  const { results, setSelected, setClicked, setErrors } = data;
  const card = results[index];

  return (
    <ListItem
      onClick={() => {
        setClicked(card.id);
        setSelected((selected: any) => ({
          ...selected,
          [card.id]: { name: card.name, quantity: 1 },
        }));
        setErrors({});
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
  setErrors,
}: {
  query: string;
  selected: { [id: string]: any };
  setSelected: (selected: { [id: string]: any }) => void;
  setClicked: (id: string) => void;
  setErrors: (errors: any) => void;
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
          itemData={{
            results: selectedRemoved,
            setSelected,
            setClicked,
            setErrors,
          }}
        >
          {renderRow}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
}
