import React, { useState, useCallback } from "react";
import {
  Box,
  List,
  ListItem,
  Checkbox,
  IconButton,
  Card,
  CardContent,
  TextField,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type {
  IPayloadTodoSubtodo,
  ITodoCardProps,
  ITodoItem,
} from "../../types/todo.type";
import { useTodoStore } from "../../hooks/todoStore";
import TodoBadge from "./TodoBadge";

const TodoCard: React.FC<ITodoCardProps> = ({
  todo,
  loggedInUser,
  handleOpenEditModal,
  handleDeleteClick,
}) => {
  const {
    todoStore_toggleMainTodoCompletion,
    todoStore_toggleSubTodoCompletion,
    todoStore_addSubTodo,
    todoStore_updateTodo,
  } = useTodoStore();

  const [editingSubTodo, setEditingSubTodo] = useState<{
    [key: string]: string;
  }>({});

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const TodoCard_handleMenuClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const TodoCard_handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const TodoCard_handleUpdateSubTodoText = useCallback(
    (subTodoId: string, newText: string) => {
      if (loggedInUser) {
        setEditingSubTodo((prev) => ({
          ...prev,
          [`${todo.id}-${subTodoId}`]: newText,
        }));

        const updatedSubTodos = todo.subTodos.map((sub) =>
          sub.id === subTodoId ? { ...sub, text: newText } : sub
        );
        todoStore_updateTodo(loggedInUser, {
          ...todo,
          subTodos: updatedSubTodos,
        });
      }
    },
    [loggedInUser, todo, todoStore_updateTodo]
  );

  const TodoCard_handleEditTodo = useCallback(
    (todo: ITodoItem) => {
      handleOpenEditModal(todo);
      TodoCard_handleMenuClose();
    },
    [handleOpenEditModal, TodoCard_handleMenuClose]
  );

  const TodoCard_handleDeleteTodo = useCallback(
    (payload: IPayloadTodoSubtodo) => {
      handleDeleteClick({ ...payload });
      TodoCard_handleMenuClose();
    },
    [handleDeleteClick, TodoCard_handleMenuClose]
  );
  const TodoCard_handleCreateSubTodo = useCallback(
    (todoPayload: ITodoItem) => {
      if (loggedInUser) {
        if (todoPayload.isCompleted) {
          todoStore_updateTodo(loggedInUser, {
            ...todoPayload,
            isCompleted: false,
          });
        }
        todoStore_addSubTodo(loggedInUser, todoPayload.id, "");
      }
    },
    [loggedInUser, todoStore_addSubTodo, todoStore_updateTodo]
  );

  return (
    <Card
      sx={{
        mb: 2,
        border: "1px solid #CDD5E0",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Checkbox
            id={`TodoCard-Checkbox-${todo.id}`}
            checked={todo.isCompleted}
            onChange={(e) =>
              loggedInUser &&
              todoStore_toggleMainTodoCompletion(
                loggedInUser,
                todo.id,
                e.target.checked
              )
            }
          />
          <Typography
            id={`TodoCard-Typography-${todo.id}-${todo.text}`}
            sx={{
              textDecoration: todo.isCompleted ? "line-through" : "none",
              flex: "1 1 0",
            }}
          >
            {todo.text}
          </Typography>

          <TodoBadge date={todo.dueDate} isCompleted={todo.isCompleted} />

          <IconButton
            id={`TodoCard-IconButton-${todo.id}-${todo.text}`}
            onClick={TodoCard_handleMenuClick}
            sx={{ ml: "auto" }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id={`TodoCard-Menu-${todo.id}-${todo.text}`}
            anchorEl={anchorEl}
            open={openMenu}
            onClose={TodoCard_handleMenuClose}
          >
            <MenuItem
              id={`TodoCard-MenuItem-${todo.id}-${todo.text}-edit`}
              onClick={() => TodoCard_handleEditTodo(todo)}
            >
              Edit
            </MenuItem>
            <MenuItem
              id={`TodoCard-MenuItem-${todo.id}-${todo.text}-delete`}
              onClick={() => {
                const payload: IPayloadTodoSubtodo = {
                  type: "main",
                  mainTodoId: todo.id,
                  mainTodoText: todo.text,
                };
                TodoCard_handleDeleteTodo(payload);
              }}
            >
              Delete
            </MenuItem>
            <MenuItem
              id={`TodoCard-MenuItem-${todo.id}-${todo.text}-create`}
              onClick={() => TodoCard_handleCreateSubTodo(todo)}
            >
              Create Sub To-do
            </MenuItem>
          </Menu>
        </Box>

        {todo.subTodos && todo.subTodos.length > 0 && (
          <List dense>
            {todo.subTodos.map((subTodo) => (
              <ListItem
                id={`TodoCard-ListItem-${todo.id}-${todo.text}-${subTodo.id}`}
                key={subTodo.id}
                disablePadding
                sx={{}}
              >
                <Card
                  sx={{
                    width: "100%",
                    mb: 2,
                  }}
                >
                  <CardContent sx={{ pb: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Checkbox
                        id={`TodoCard-Checkbox-${todo.id}-${todo.text}-${subTodo.id}-${subTodo.text}-checkbox`}
                        checked={subTodo.isCompleted}
                        onChange={(e) =>
                          loggedInUser &&
                          todoStore_toggleSubTodoCompletion(
                            loggedInUser,
                            todo.id,
                            subTodo.id,
                            e.target.checked
                          )
                        }
                      />
                      <TextField
                        id={`TodoCard-TextField-${todo.id}-${todo.text}-${subTodo.id}-${subTodo.text}-checkbox`}
                        variant="standard"
                        value={
                          typeof editingSubTodo[`${todo.id}-${subTodo.id}`] ===
                          "string"
                            ? editingSubTodo[`${todo.id}-${subTodo.id}`]
                            : subTodo.text
                        }
                        onChange={(e) =>
                          TodoCard_handleUpdateSubTodoText(
                            subTodo.id,
                            e.target.value
                          )
                        }
                        onBlur={(e) => {
                          if (e.target.value !== subTodo.text) {
                            setEditingSubTodo((prev) => {
                              const newState = { ...prev };
                              delete newState[`${todo.id}-${subTodo.id}`];
                              return newState;
                            });
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        sx={{
                          flexGrow: 1,
                          "& .MuiInputBase-input": {
                            textDecoration: subTodo.isCompleted
                              ? "line-through"
                              : "none",
                          },
                        }}
                      />
                      <IconButton
                        id={`TodoCard-IconButton-${todo.id}-${todo.text}-${subTodo.id}-${subTodo.text}`}
                        onClick={() => {
                          const payload: IPayloadTodoSubtodo = {
                            type: "sub",
                            mainTodoId: todo.id,
                            mainTodoText: todo.text,
                            subTodoId: subTodo.id,
                            subTodoText: subTodo.text,
                          };
                          handleDeleteClick(payload);
                        }}
                        size="small"
                        color="default"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default TodoCard;
