import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CssBaseline,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import ImgTodo from "../../core/assets/img-todo.png";
import ImgEmpty from "../../core/assets/img-empty.png";
import { useTodoStore } from "../../core/hooks/todoStore";
import { localStorage_getLoggedInUser } from "../../core/services/localStorageService";
import TodoModal from "../../core/components/todo/TodoModal";
import type {
  IPayloadTodoSubtodo,
  ITodoItem,
} from "../../core/types/todo.type";
import { useAuthStore } from "../../core/hooks/authStore";
import ConfirmationDialog from "../../core/components/common/ConfirmationDialog";
import Sidebar from "../../core/components/layout/Sidebar";
import Header from "../../core/components/layout/Header";
import TodoCard from "../../core/components/todo/TodoCard";

const drawerWidth = 250;

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const { authStore_logout } = useAuthStore();
  const {
    todoStore_todos,
    todoStore_isLoading,
    todoStore_error,
    todoStore_loadTodos,
    todoStore_deleteTodo,
    todoStore_deleteSubTodo,
  } = useTodoStore();

  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<ITodoItem | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IPayloadTodoSubtodo | null>(
    null
  );

  useEffect(() => {
    const user = localStorage_getLoggedInUser();
    if (user) {
      setLoggedInUser(user);
      todoStore_loadTodos(user);
    } else {
      navigate("/login");
    }
  }, [todoStore_loadTodos, navigate]);

  const mainPage_handleLogout = useCallback(() => {
    authStore_logout();
    navigate("/login");
  }, [authStore_logout, navigate]);

  const mainPage_handleOpenAddModal = useCallback(() => {
    setEditingTodo(null);
    setIsModalOpen(true);
  }, []);

  const mainPage_handleOpenEditModal = useCallback((todo: ITodoItem) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  }, []);

  const mainPage_handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTodo(null);
  }, []);

  const notCheckedTodos = useMemo(
    () => todoStore_todos.filter((todo) => !todo.isCompleted),
    [todoStore_todos]
  );
  const checkedTodos = useMemo(
    () => todoStore_todos.filter((todo) => todo.isCompleted),
    [todoStore_todos]
  );

  const mainPage_handleDeleteClick = useCallback(
    (payload: IPayloadTodoSubtodo) => {
      setItemToDelete({
        type: payload.type,
        mainTodoId: payload.mainTodoId,
        mainTodoText: payload.mainTodoText,
        subTodoId: payload.subTodoId,
        subTodoText: payload.subTodoText,
      });
      setOpenConfirmDialog(true);
    },
    []
  );

  const mainPage_handleCloseConfirmDialog = useCallback(() => {
    setOpenConfirmDialog(false);
    setItemToDelete(null);
  }, []);

  const mainPage_handleConfirmDelete = useCallback(() => {
    if (loggedInUser && itemToDelete) {
      if (itemToDelete.type === "main") {
        todoStore_deleteTodo(loggedInUser, itemToDelete.mainTodoId!);
      } else if (itemToDelete.type === "sub") {
        todoStore_deleteSubTodo(
          loggedInUser,
          itemToDelete.mainTodoId!,
          itemToDelete.subTodoId!
        );
      }
    }
    mainPage_handleCloseConfirmDialog();
  }, [
    loggedInUser,
    itemToDelete,
    todoStore_deleteTodo,
    todoStore_deleteSubTodo,
    mainPage_handleCloseConfirmDialog,
  ]);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <Sidebar drawerWidth={drawerWidth} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <Header
          loggedInUser={loggedInUser}
          handleLogout={mainPage_handleLogout}
        />

        <Container maxWidth="lg" sx={{ pt: 4, pb: 4, flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              mb: 3,
              gap: 2,
            }}
          >
            <Box
              id={`MainPage-Box-image-ImgTodo`}
              component="img"
              src={ImgTodo}
              alt="ImgTodo"
              sx={{
                width: "auto",
                height: "auto",
              }}
            />
            <Typography variant="h5" component="h1">
              Todo
            </Typography>
            <Button
              id={`MainPage-Button-create-todo`}
              sx={{
                textTransform: "none",
                backgroundColor: "background.default",
                color: "#4F4F4F",
                border: "1px solid #BDBDBD",
                width: "200px",
                "&:hover": { opacity: 0.7 },
              }}
              onClick={mainPage_handleOpenAddModal}
            >
              Created Todo
              <AddIcon sx={{ ml: 1 }} />
            </Button>
          </Box>
          {todoStore_isLoading && (
            <Typography id={`MainPage-Typography-loading-store`}>
              Loading todos...
            </Typography>
          )}
          {todoStore_error && (
            <Typography id={`MainPage-Typography-error-store`} color="error">
              Error: {todoStore_error}
            </Typography>
          )}
          {todoStore_todos.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "calc(100% - 120px)",
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Box
                id={`MainPage-Box-image-ImgEmpty`}
                component="img"
                src={ImgEmpty}
                alt="ImgEmpty"
                sx={{
                  width: "auto",
                  height: "auto",
                }}
              />
              <Typography
                color="text.primary"
                sx={{
                  opacity: "0.3",
                }}
              >
                You Don't Have a Todo Yet
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ flex: 1, minWidth: "300px" }}>
                <Paper
                  elevation={2}
                  sx={{
                    padding: { xs: 3, sm: 4 },
                    borderRadius: 2,
                    width: "100%",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Not Checked
                  </Typography>
                  {notCheckedTodos.length === 0 ? (
                    <Typography
                      id={`MainPage-Typography-notCheckedTodos`}
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 2 }}
                    >
                      No notCheckedTodos
                    </Typography>
                  ) : (
                    notCheckedTodos.map((todo) => (
                      <TodoCard
                        key={todo.id}
                        todo={todo}
                        loggedInUser={loggedInUser}
                        handleOpenEditModal={mainPage_handleOpenEditModal}
                        handleDeleteClick={mainPage_handleDeleteClick}
                      />
                    ))
                  )}
                </Paper>
              </Box>

              <Box sx={{ flex: 1, minWidth: "300px" }}>
                <Paper
                  elevation={2}
                  sx={{
                    padding: { xs: 3, sm: 4 },
                    borderRadius: 2,
                    width: "100%",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Checked
                  </Typography>
                  {checkedTodos.length === 0 ? (
                    <Typography
                      id={`MainPage-Typography-Checked`}
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 2 }}
                    >
                      No Todos
                    </Typography>
                  ) : (
                    checkedTodos.map((todo) => (
                      <TodoCard
                        key={todo.id}
                        todo={todo}
                        loggedInUser={loggedInUser}
                        handleOpenEditModal={mainPage_handleOpenEditModal}
                        handleDeleteClick={mainPage_handleDeleteClick}
                      />
                    ))
                  )}
                </Paper>
              </Box>
            </Box>
          )}
        </Container>
      </Box>

      {isModalOpen && (
        <TodoModal
          open={isModalOpen}
          onClose={mainPage_handleCloseModal}
          userId={loggedInUser ?? ""}
          todoToEdit={editingTodo}
        />
      )}

      <ConfirmationDialog
        open={openConfirmDialog}
        onClose={mainPage_handleCloseConfirmDialog}
        onConfirm={mainPage_handleConfirmDelete}
        title={"Confirm Delete"}
        description={`Are you sure want to delete ${
          itemToDelete?.subTodoText ?? itemToDelete?.mainTodoText ?? ""
        }?`}
        confirmButtonText="Confirm"
        cancelButtonText="Cancel"
      />
    </Box>
  );
};

export default MainPage;
