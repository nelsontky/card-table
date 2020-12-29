import React from "react";
import { withStyles, Theme, fade } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useDispatch, useSelector } from "react-redux";

import { ICardMenu } from "../interfaces";
import { flip, rotate } from "../slices/gameSlice";
import { getConn } from "../lib/peer";

const options = ["Flip", "Rotate right", "Rotate 180°", "Rotate left"];

const ITEM_HEIGHT = 40;

const ColoredIconButton = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: fade(theme.palette.common.black, 0.8),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.black, 0.6),
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        backgroundColor: fade(theme.palette.common.black, 0.6),
      },
    },
  },
}))(IconButton);

export default function CardMenu({
  card,
  isOpen,
  setIsOpen,
  ...rest
}: ICardMenu) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dispatch = useDispatch();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const playerId = useSelector((state: any) => state.playerId);

  const onSelect = (event: React.MouseEvent<HTMLElement>, option: string) => {
    event.stopPropagation();
    switch (option) {
      case "Flip":
        dispatch(flip(playerId, card));

        getConn().then((conn) => {
          conn.send(
            JSON.stringify({
              action: "flip",
              card,
              playerId,
            })
          );
        });
        break;
      case "Rotate right":
        dispatch(rotate(playerId, card, 90));

        getConn().then((conn) => {
          conn.send(
            JSON.stringify({
              action: "rotate",
              card,
              angle: 90,
              playerId,
            })
          );
        });
        break;
      case "Rotate left":
        dispatch(rotate(playerId, card, -90));

        getConn().then((conn) => {
          conn.send(
            JSON.stringify({
              action: "rotate",
              card,
              angle: -90,
              playerId,
            })
          );
        });
        break;
      case "Rotate 180°":
        dispatch(rotate(playerId, card, 180));

        getConn().then((conn) => {
          conn.send(
            JSON.stringify({
              action: "rotate",
              card,
              angle: 180,
              playerId,
            })
          );
        });
        break;
      default:
      // TODO throw error
    }
    handleClose();
  };

  return (
    <div className={rest.className}>
      <ColoredIconButton size="small" onClick={handleClick}>
        <MoreVertIcon fontSize="small" />
      </ColoredIconButton>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 3,
            width: "20ch",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              onSelect(event, option);
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
