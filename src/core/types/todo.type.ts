export interface ITodoStore {
  todoStore_todos: ITodoItem[];
  todoStore_isLoading: boolean;
  todoStore_error: string | null;
  todoStore_loadTodos: (userId: string) => void;
  todoStore_addTodo: (userId: string, text: string, dueDate: string) => void;
  todoStore_updateTodo: (userId: string, updatedTodo: ITodoItem) => void;
  todoStore_deleteTodo: (userId: string, todoId: string) => void;
  todoStore_toggleMainTodoCompletion: (
    userId: string,
    todoId: string,
    isCompleted: boolean
  ) => void;
  todoStore_toggleSubTodoCompletion: (
    userId: string,
    todoId: string,
    subTodoId: string,
    isCompleted: boolean
  ) => void;
  todoStore_addSubTodo: (
    userId: string,
    todoId: string,
    subTodoText: string
  ) => void;
  todoStore_updateSubTodo: (
    userId: string,
    todoId: string,
    updatedTodo: ITodoItem
  ) => void;
  todoStore_deleteSubTodo: (
    userId: string,
    todoId: string,
    subTodoId: string
  ) => void;
}

export interface ITodoItem {
  id: string;
  userId: string;
  text: string;
  dueDate: string;
  isCompleted: boolean;
  subTodos: ISubITodoItem[];
  createdAt: string;
}

export interface ISubITodoItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface ITodoConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export interface ITodoBadgeProps {
  date: string;
  isCompleted?: boolean;
}

export interface IPayloadTodoSubtodo {
  type: "main" | "sub";
  mainTodoId: string;
  mainTodoText: string;
  subTodoId?: string;
  subTodoText?: string;
}

export interface ITodoCardProps {
  todo: ITodoItem;
  loggedInUser: string | null;
  handleOpenEditModal: (todo: ITodoItem) => void;
  handleDeleteClick: (payload: IPayloadTodoSubtodo) => void;
}

export interface ITodoModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  todoToEdit?: ITodoItem | null;
}
