import {
  UserState,
  UserActionTypes,
  SET_USER,
  UPDATE_USER,
  CLEAR_USER,
  SET_LOADING,
  SET_ERROR,
} from './types';

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userReducer = (state = initialState, action: UserActionTypes): UserState => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: true,
        error: null,
      };

    case UPDATE_USER:
      return {
        ...state,
        currentUser: state.currentUser
          ? { ...state.currentUser, ...action.payload }
          : null,
        error: null,
      };

    case CLEAR_USER:
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false,
        error: null,
      };

    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default userReducer;