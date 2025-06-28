import React, { useEffect, useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/id";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTodoStore } from "../../../core/hooks/todoStore";
import type { ITodoModalProps } from "../../types/todo.type";

const TodoModal: React.FC<ITodoModalProps> = ({
  open,
  onClose,
  userId,
  todoToEdit,
}) => {
  const { todoStore_addTodo, todoStore_updateTodo } = useTodoStore();

  const [modalTodoText, setModalTodoText] = useState("");
  const [modalTodoTextError, setModalTodoTextError] = useState("");
  const [modalDueDate, setModalDueDate] = useState<Dayjs | null>(null);
  const [modalDueDateError, setModalDueDateError] = useState("");

  useEffect(() => {
    if (open) {
      if (todoToEdit) {
        setModalTodoText(todoToEdit.text);
        setModalDueDate(dayjs(todoToEdit.dueDate));
      } else {
        setModalTodoText("");
        setModalDueDate(null);
      }
      setModalTodoTextError("");
      setModalDueDateError("");
    }
  }, [open, todoToEdit]);

  const TodoModal_validateAndSave = () => {
    const isTodoTextValid = TodoModal_validateTodoText();
    const isDueDateValid = TodoModal_validateDueDate();

    if (isTodoTextValid && isDueDateValid && modalDueDate?.isValid()) {
      TodoModal_saveTodo();
      TodoModal_onClose();
    }
  };

  const TodoModal_validateTodoText = () => {
    if (!modalTodoText.trim()) {
      setModalTodoTextError("Todo is required");
      return false;
    }
    setModalTodoTextError("");
    return true;
  };

  const TodoModal_validateDueDate = () => {
    if (!modalDueDate?.isValid()) {
      setModalDueDateError("Date Time is required");
      return false;
    }

    if (!todoToEdit) {
      const startOfCurrentHour = dayjs().startOf("hour");
      if (modalDueDate.isBefore(startOfCurrentHour)) {
        setModalDueDateError("Date Time must be greater then now");
        return false;
      }
    }

    setModalDueDateError("");
    return true;
  };

  const TodoModal_saveTodo = () => {
    const formattedDueDate = modalDueDate!.toISOString();

    if (todoToEdit) {
      todoStore_updateTodo(userId, {
        ...todoToEdit,
        text: modalTodoText,
        dueDate: formattedDueDate,
      });
    } else {
      todoStore_addTodo(userId, modalTodoText, formattedDueDate);
    }
  };

  const TodoModal_onClose = () => {
    onClose();
  };

  return (
    <Dialog
      id="TodoModal-Dialog-dialog"
      open={open}
      onClose={TodoModal_onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        id="TodoModal-dialog-title"
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
            id="TodoModal-Typography-title-text"
            variant="h6"
            sx={{ fontWeight: 500 }}
          >
            {todoToEdit ? "Edit Todo" : "Create Todo"}
          </Typography>
          <IconButton
            id="TodoModal-IconButton-close-x"
            aria-label="close"
            onClick={TodoModal_onClose}
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
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: 2,
          }}
        >
          <TextField
            id="TodoModal-TextField-input-title-to-do"
            autoFocus
            margin="dense"
            label="Todo"
            type="text"
            fullWidth
            variant="outlined"
            value={modalTodoText}
            onChange={(e) => {
              setModalTodoText(e.target.value);
              setModalTodoTextError("");
            }}
            error={!!modalTodoTextError}
            helperText={modalTodoTextError}
            sx={{ mb: 2 }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
            <DateTimePicker
              label="Date Time"
              value={modalDueDate}
              onChange={(newValue) => {
                setModalDueDate(newValue);
                setModalDueDateError("");
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                  error: !!modalDueDateError,
                  helperText: modalDueDateError,
                },
              }}
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          id="TodoModal-Button-action-save"
          onClick={TodoModal_validateAndSave}
          color="primary"
          variant="contained"
        >
          Save
        </Button>
        <Button
          id="TodoModal-Button-action-Cancel"
          onClick={TodoModal_onClose}
          variant="contained"
          sx={{
            backgroundColor: "secondary.main",
            color: "primary.main",
            "&:hover": { opacity: 0.7 },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TodoModal;
