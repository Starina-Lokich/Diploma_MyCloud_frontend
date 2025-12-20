import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/apiUtils';
import type { User } from '../../types/userTypes';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};


export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'users/fetch',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/auth/users/');
      return response.data.results || response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Ошибка загрузки пользователей');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (userId: number) => {
    const response = await api.get(`/users/${userId}/`);
    return response.data;
  }
);

export const updateUser = createAsyncThunk<User, { userId: string; userData: Partial<User> }, { rejectValue: string }>(
  'users/update',
  async ({ userId, userData }, thunkAPI) => {
    try {
      const response = await api.patch(`/auth/users/${userId}/`, userData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.detail || 'Ошибка обновления пользователя');
    }
  }
);

export const deleteUser = createAsyncThunk('users/delete', async (userId: string) => {
  await api.delete(`/auth/users/${userId}/`);
  return userId;
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки пользователей';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      });
  },
});

export default userSlice.reducer;
