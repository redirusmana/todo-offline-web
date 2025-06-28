import { create } from "zustand";
import type { ITodoItem, ISubITodoItem, ITodoStore } from "../types/todo.type";
import {
  localStorage_getUserTodos,
  localStorage_saveUserTodos,
  localStorage_generateUniqueId,
} from "../services/localStorageService";
import { parseISODateTime } from "../utils/date";
import dayjs from "dayjs";

export const useTodoStore = create<ITodoStore>((set, get) => ({
  todoStore_todos: [],
  todoStore_isLoading: false,
  todoStore_error: null,

  todoStore_loadTodos: (userId: string) => {
    set({ todoStore_isLoading: true, todoStore_error: null });
    try {
      const storedTodos = localStorage_getUserTodos(userId);
      const sortedTodos = storedTodos
        .map((todo) => ({
          ...todo,
          subTodos: todo.subTodos.map((sub) => ({
            ...sub,
            id: sub.id || localStorage_generateUniqueId(),
          })),
        }))
        .sort((a, b) => {
          if (a.isCompleted === b.isCompleted) {
            const dateA = parseISODateTime(a.dueDate).valueOf();
            const dateB = parseISODateTime(b.dueDate).valueOf();
            return a.isCompleted ? dateB - dateA : dateA - dateB;
          }
          return a.isCompleted ? 1 : -1;
        });
      set({ todoStore_todos: sortedTodos, todoStore_isLoading: false });
    } catch (err: unknown) {
      console.error("Failed to load todoStore_todos:", err);
      set({
        todoStore_isLoading: false,
        todoStore_error: err instanceof Error ? err.message : String(err),
      });
    }
  },

  todoStore_addTodo: (userId: string, text: string, dueDate: string) => {
    set({ todoStore_isLoading: true, todoStore_error: null });
    try {
      const currentTodos = get().todoStore_todos;
      const newTodo: ITodoItem = {
        id: localStorage_generateUniqueId(),
        userId,
        text,
        dueDate,
        isCompleted: false,
        subTodos: [],
        createdAt: dayjs().toISOString(),
      };
      const updatedTodos = [...currentTodos, newTodo];
      localStorage_saveUserTodos(userId, updatedTodos);
      get().todoStore_loadTodos(userId);
      set({ todoStore_isLoading: false });
    } catch (err: unknown) {
      console.error("Failed to add todo:", err);
      set({
        todoStore_isLoading: false,
        todoStore_error: err instanceof Error ? err.message : String(err),
      });
    }
  },

  todoStore_updateTodo: (userId: string, updatedTodo: ITodoItem) => {
    set({ todoStore_isLoading: true, todoStore_error: null });
    try {
      const currentTodos = get().todoStore_todos;
      const updatedTodos = currentTodos.map((todo) =>
        todo.id === updatedTodo.id ? { ...updatedTodo } : todo
      );
      localStorage_saveUserTodos(userId, updatedTodos);
      get().todoStore_loadTodos(userId);
      set({ todoStore_isLoading: false });
    } catch (err: unknown) {
      console.error("Failed to update todo:", err);
      set({
        todoStore_isLoading: false,
        todoStore_error: err instanceof Error ? err.message : String(err),
      });
    }
  },

  todoStore_deleteTodo: (userId: string, todoId: string) => {
    set({ todoStore_isLoading: true, todoStore_error: null });
    try {
      const currentTodos = get().todoStore_todos;
      const updatedTodos = currentTodos.filter((todo) => todo.id !== todoId);
      localStorage_saveUserTodos(userId, updatedTodos);
      get().todoStore_loadTodos(userId);
      set({ todoStore_isLoading: false });
    } catch (err: unknown) {
      console.error("Failed to delete todo:", err);
      set({
        todoStore_isLoading: false,
        todoStore_error: err instanceof Error ? err.message : String(err),
      });
    }
  },

  todoStore_toggleMainTodoCompletion: (
    userId: string,
    todoId: string,
    isCompleted: boolean
  ) => {
    set({ todoStore_isLoading: true, todoStore_error: null });
    try {
      const currentTodos = get().todoStore_todos;
      const updatedTodos = currentTodos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              isCompleted,
              subTodos: todo.subTodos.map((sub) => ({ ...sub, isCompleted })),
            }
          : todo
      );
      localStorage_saveUserTodos(userId, updatedTodos);
      get().todoStore_loadTodos(userId);
      set({ todoStore_isLoading: false });
    } catch (err: unknown) {
      console.error("Failed to toggle main todo completion:", err);
      set({
        todoStore_isLoading: false,
        todoStore_error: err instanceof Error ? err.message : String(err),
      });
    }
  },

  todoStore_toggleSubTodoCompletion: (
    userId: string,
    todoId: string,
    subTodoId: string,
    isCompleted: boolean
  ) => {
    set({ todoStore_isLoading: true, todoStore_error: null });
    try {
      const currentTodos = get().todoStore_todos;
      const updatedTodos = currentTodos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subTodos: todo.subTodos.map((sub) =>
                sub.id === subTodoId ? { ...sub, isCompleted } : sub
              ),
            }
          : todo
      );

      const mainTodo = updatedTodos.find((t) => t.id === todoId);
      if (mainTodo) {
        const allSubTodosCompleted = mainTodo.subTodos.every(
          (sub) => sub.isCompleted
        );
        const anySubTodoUnchecked = mainTodo.subTodos.some(
          (sub) => !sub.isCompleted
        );

        if (allSubTodosCompleted && !mainTodo.isCompleted) {
          mainTodo.isCompleted = true;
        } else if (anySubTodoUnchecked && mainTodo.isCompleted) {
          mainTodo.isCompleted = false;
        }
      }

      localStorage_saveUserTodos(userId, updatedTodos);
      get().todoStore_loadTodos(userId);
      set({ todoStore_isLoading: false });
    } catch (err: unknown) {
      console.error("Failed to toggle sub todo completion:", err);
      set({
        todoStore_isLoading: false,
        todoStore_error: err instanceof Error ? err.message : String(err),
      });
    }
  },

  todoStore_addSubTodo: (
    userId: string,
    todoId: string,
    subTodoText: string
  ) => {
    set({ todoStore_isLoading: true, todoStore_error: null });
    try {
      const currentTodos = get().todoStore_todos;
      const newSubTodo: ISubITodoItem = {
        id: localStorage_generateUniqueId(),
        text: subTodoText,
        isCompleted: false,
      };
      const updatedTodos = currentTodos.map((todo) =>
        todo.id === todoId
          ? { ...todo, subTodos: [...todo.subTodos, newSubTodo] }
          : todo
      );
      localStorage_saveUserTodos(userId, updatedTodos);
      get().todoStore_loadTodos(userId);
      set({ todoStore_isLoading: false });
    } catch (err: unknown) {
      console.error("Failed to add sub todo:", err);
      set({
        todoStore_isLoading: false,
        todoStore_error: err instanceof Error ? err.message : String(err),
      });
    }
  },

  todoStore_updateSubTodo: (
    userId: string,
    todoId: string,
    updatedTodo: ITodoItem
  ) => {
    set({ todoStore_isLoading: true, todoStore_error: null });
    try {
      const currentTodos = get().todoStore_todos;
      const updatedTodos = currentTodos.map((todo) =>
        todo.id === todoId ? { ...updatedTodo } : todo
      );
      localStorage_saveUserTodos(userId, updatedTodos);
      get().todoStore_loadTodos(userId);
      set({ todoStore_isLoading: false });
    } catch (err: unknown) {
      console.error("Failed to update sub todo (via main todo update):", err);
      set({
        todoStore_isLoading: false,
        todoStore_error: err instanceof Error ? err.message : String(err),
      });
    }
  },

  todoStore_deleteSubTodo: (
    userId: string,
    todoId: string,
    subTodoId: string
  ) => {
    set({ todoStore_isLoading: true, todoStore_error: null });
    try {
      const currentTodos = get().todoStore_todos;
      const updatedTodos = currentTodos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subTodos: todo.subTodos.filter((sub) => sub.id !== subTodoId),
            }
          : todo
      );
      const mainTodo = updatedTodos.find((t) => t.id === todoId);
      if (mainTodo) {
        const anySubTodoUnchecked = mainTodo.subTodos.some(
          (sub) => !sub.isCompleted
        );
        if (anySubTodoUnchecked && mainTodo.isCompleted) {
          mainTodo.isCompleted = false;
        }
      }

      localStorage_saveUserTodos(userId, updatedTodos);
      get().todoStore_loadTodos(userId);
      set({ todoStore_isLoading: false });
    } catch (err: unknown) {
      console.error("Failed to delete sub todo:", err);
      set({
        todoStore_isLoading: false,
        todoStore_error: err instanceof Error ? err.message : String(err),
      });
    }
  },
}));
