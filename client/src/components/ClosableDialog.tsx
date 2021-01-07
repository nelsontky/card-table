import React from "react";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";

import CloseIcon from "@material-ui/icons/Close";

export interface IClosableDialog {
  isOpen: boolean;
  close: () => void;
  children?: React.ReactNode;
  DialogProps?: DialogProps;
  [x: string]: any;
}

export default function ClosableDialog({
  isOpen,
  close,
  children,
  DialogProps,
  ...rest
}: IClosableDialog) {
  return (
    <Dialog onClose={close} {...rest} {...DialogProps} open={isOpen}>
      <DialogActions>
        <IconButton size="small" onClick={close}>
          <CloseIcon />
        </IconButton>
      </DialogActions>
      {children}
    </Dialog>
  );
}
