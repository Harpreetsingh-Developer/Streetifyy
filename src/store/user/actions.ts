import {
  User,
  UserActionTypes,
  SET_USER,
  UPDATE_USER,
  CLEAR_USER,
  SET_LOADING,
  SET_ERROR,
} from './types';

export const setUser = (user: User): UserActionTypes => ({
  type: SET_USER,
  payload: user,
});

export const updateUser = (userData: Partial<User>): UserActionTypes => ({
  type: UPDATE_USER,
  payload: userData,
});

export const clearUser = (): UserActionTypes => ({
  type: CLEAR_USER,
});

export const setLoading = (loading: boolean): UserActionTypes => ({
  type: SET_LOADING,
  payload: loading,
});

export const setError = (error: string | null): UserActionTypes => ({
  type: SET_ERROR,
  payload: error,
});

// Async action creators
export const updateUserProfile = (userData: Partial<User>) => {
  return async (dispatch: any) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // TODO: Implement API call to update user profile
      // const response = await api.updateUserProfile(userData);
      // dispatch(updateUser(response.data));

      // Temporary mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch(updateUser(userData));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to update profile'));
    } finally {
      dispatch(setLoading(false));
    }
  };
};