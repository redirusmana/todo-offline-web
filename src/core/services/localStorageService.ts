import type { ITodoItem } from "../types/todo.type";
import type { IUser } from "../types/user.type";
import dayjs from "dayjs";

const USERS_KEY = "todo_app_users";
const LOGGED_IN_USER_KEY = "todo_app_logged_in_user";

const localStorage_getAllUsersData = (): {
  [email: string]: { user: IUser; todos: ITodoItem[] };
} => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : {};
};

const localStorage_saveAllUsersData = (data: {
  [email: string]: { user: IUser; todos: ITodoItem[] };
}) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(data));
};

export const localStorage_getUserTodos = (userId: string): ITodoItem[] => {
  const allUsersData = localStorage_getAllUsersData();
  return allUsersData[userId]?.todos || [];
};

export const localStorage_saveUserTodos = (
  userId: string,
  todos: ITodoItem[]
): void => {
  const allUsersData = localStorage_getAllUsersData();
  if (allUsersData[userId]) {
    allUsersData[userId].todos = todos;
  } else {
    allUsersData[userId] = { user: { email: userId }, todos: todos };
  }
  localStorage_saveAllUsersData(allUsersData);
};

export const localStorage_addUser = (user: IUser): void => {
  const allUsersData = localStorage_getAllUsersData();
  if (!allUsersData[user.email]) {
    allUsersData[user.email] = { user, todos: [] };
    localStorage_saveAllUsersData(allUsersData);
  }
};

export const localStorage_loginUser = (email: string): void => {
  localStorage.setItem(LOGGED_IN_USER_KEY, email);
};

export const localStorage_logoutUser = (): void => {
  localStorage.removeItem(LOGGED_IN_USER_KEY);
};

export const localStorage_getLoggedInUser = (): string | null => {
  return localStorage.getItem(LOGGED_IN_USER_KEY);
};

export const localStorage_isUserExists = (email: string): IUser | null => {
  const allUsersData = localStorage_getAllUsersData();
  const userDataEntry = allUsersData[email];
  return userDataEntry ? userDataEntry.user : null;
};

export const localStorage_isValidateUser = (
  email: string,
  passwordAttempt: string
): IUser | null => {
  const allUsersData = localStorage_getAllUsersData();
  const userDataEntry = allUsersData[email];

  if (!userDataEntry) {
    return null;
  }

  const storedUser = userDataEntry.user;

  if (!storedUser.password) {
    if (passwordAttempt) {
      return null;
    }
    return null;
  }

  if (storedUser.password === passwordAttempt) {
    return storedUser;
  } else {
    return null;
  }
};

export const localStorage_generateUniqueId = (): string => {
  return (
    dayjs().valueOf().toString(36) + Math.random().toString(36).substring(2, 11)
  );
};
