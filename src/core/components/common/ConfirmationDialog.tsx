import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { ITodoConfirmDialogProps } from "../../types/todo.type";

const ConfirmationDialog: React.FC<ITodoConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        id="ConfirmationDialog-DialogTitle-title"
        sx={{
          backgroundColor: "background.default",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 500 }}
            id="ConfirmationDialog-Typography-title"
          >
            {title}
          </Typography>
          <IconButton
            id="ConfirmationDialog-IconButton-close"
            onClick={onClose}
            sx={{
              color: "primary.dark",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            marginTop: 2,
          }}
        >
          <DialogContentText id="ConfirmationDialog-DialogContentText-description">
            {description}
          </DialogContentText>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          id="ConfirmationDialog-Button-yes-button"
          onClick={onConfirm}
          color="primary"
          variant="contained"
        >
          {confirmButtonText}
        </Button>
        <Button
          id="ConfirmationDialog-Button-no-button"
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "secondary.main",
            color: "primary.main",
            "&:hover": { opacity: 0.7 },
          }}
        >
          {cancelButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
