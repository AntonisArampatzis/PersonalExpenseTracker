import * as React from "react";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import { useEffect } from "react";

type MessageProps = {
  message: string;
};

export default function Message({ message }: MessageProps) {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
  }, [message]);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      message={message}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    />
  );
}
