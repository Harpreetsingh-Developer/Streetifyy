export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  profilePicture?: string;
  following?: string[];
  followers?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Action Types
export const SET_USER = 'user/SET_USER';
export const UPDATE_USER = 'user/UPDATE_USER';
export const CLEAR_USER = 'user/CLEAR_USER';
export const SET_LOADING = 'user/SET_LOADING';
export const SET_ERROR = 'user/SET_ERROR';

interface SetUserAction {
  type: typeof SET_USER;
  payload: User;
}

interface UpdateUserAction {
  type: typeof UPDATE_USER;
  payload: Partial<User>;
}

interface ClearUserAction {
  type: typeof CLEAR_USER;
}

interface SetLoadingAction {
  type: typeof SET_LOADING;
  payload: boolean;
}

interface SetErrorAction {
  type: typeof SET_ERROR;
  payload: string | null;
}

export type UserActionTypes =
  | SetUserAction
  | UpdateUserAction
  | ClearUserAction
  | SetLoadingAction
  | SetErrorAction;