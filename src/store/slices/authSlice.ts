import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from '../../utils/apiUtils';
import type { User } from '../../types/userTypes';
import type { RegisterData, LoginCredentials } from '../../types/authTypes';
import api from '../../utils/apiUtils';
import { getCSRFToken } from '../../utils/apiUtils';


interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};


export const fetchCSRFToken = createAsyncThunk('auth/csrf', async () => {
  await api.get('/auth/csrf/');
});

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, thunkAPI) => {
    console.log('start login....')
    try {
      // Получаем CSRF токен перед логином
      await getCSRFToken();
      const response = await api.post<User>('/auth/login/', credentials);
      console.log('login with response:', response);

      if (response.data && response.data.id) {
        return response.data;  // Возвращаем данные пользователя
      }

      throw new Error('Invalid response structure');

    } catch (error: any) {
      if (error.response?.status === 400) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue('Неверные учетные данные');
    }
  }
);

// Проверка аутентификации при загрузке приложения ????
export const checkAuth = createAsyncThunk('auth/check', async () => {
  try {
    const response = await api.get('/auth/check_auth/');
    return response.data;
  } catch (_) {
    throw new Error('Not authenticated');
  }
});

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      await getCSRFToken();
      const response = await api.post('/auth/register/', userData);
      return response.data;
    } catch (err: any) {
        if (err.response?.data) {
          return rejectWithValue(err.response.data);
        }
        return rejectWithValue('Unknown registration error');
    }
  }

);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await axios.post('/auth/logout/');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload.user || action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<{user: User}>) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;
