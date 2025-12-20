import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/apiUtils';
import type { File } from '../../types/fileTypes';
import type { RootState } from '../store';


interface FileState {
  files: File[];
  loading: boolean;
  error: Record<string, any> | string | null;
  uploadProgress: number;
}

interface UploadConfig {
  formData: FormData;
  onUploadProgress: (progressEvent: ProgressEvent) => void;
}

const initialState: FileState = {
  files: [],
  loading: false,
  error: null,
  uploadProgress: 0,
};

export const fetchFiles = createAsyncThunk(
  'files/fetch',
  async (userId: number | undefined) => {
    const params = userId ? { user_id: userId } : {};
    const response = await api.get('/storage/files/', { params });
    return response.data;
  }
);

export const uploadFile = createAsyncThunk(
  'files/upload',
  async ({ formData, onUploadProgress }: UploadConfig, { rejectWithValue }) => {
    try {
      const response = await api.post('/storage/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });
      return response.data;
    } catch (error: any) {
      // Обработка структурированных ошибок валидации
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        file: ['Произошла неизвестная ошибка при загрузке']
      });
    }
  }
);

export const deleteFile = createAsyncThunk('files/delete', async (fileId: string) => {
  await api.delete(`/storage/files/${fileId}/`);
  return fileId;
});

export const downloadFile = createAsyncThunk(
  'files/download',
  async ({ fileId, fileName }: { fileId: string; fileName: string }, thunkAPI) => {
    const response = await api.get(`/storage/files/${fileId}/download/`, {
      responseType: 'blob',
    });

    // Обновляем дату последнего скачивания сразу после успешного скачивания
    const lastDownload = new Date().toISOString();
    thunkAPI.dispatch(updateFileLastDownload({ fileId, lastDownload }));

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return fileId;
  }
);

export const updateFile = createAsyncThunk(
  'files/update',
  async ({ fileId, updatedData }: { fileId: string; updatedData: Partial<File> }, thunkAPI) => {
    try {
      const response = await api.patch(`/storage/files/${fileId}/update/`, updatedData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Ошибка обновления файла');
    }
  }
);

export const previewFile = createAsyncThunk(
  'files/preview',
  async ({ fileId }: { fileId: string }) => {
    const response = await api.get(`/storage/files/${fileId}/preview/`, {
      responseType: 'blob',
    });
    return URL.createObjectURL(new Blob([response.data as Blob]));
  }
);

const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setUploadProgress(state, action: PayloadAction<number>) {
      state.uploadProgress = action.payload;
    },
    updateFileLastDownload: (state, action: PayloadAction<{fileId: string, lastDownload: string}>) => {
      const { fileId, lastDownload } = action.payload;
      const file = state.files.find(f => f.id === fileId);
      if (file) {
        file.last_download = lastDownload;
      }
    },
    clearFileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action: PayloadAction<File[]>) => {
        state.files = action.payload as File[];
        state.loading = false;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки файлов';
      })
      .addCase(uploadFile.pending, (state) => {
        state.uploadProgress = 0;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action: PayloadAction<File>) => {
        state.files.push(action.payload);
        state.uploadProgress = 0;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.uploadProgress = 0;
        state.error = typeof action.payload === 'string'
          ? action.payload
          : action.error.message || 'Ошибка загрузки файла';
      })
      .addCase(deleteFile.fulfilled, (state, action: PayloadAction<string>) => {
        state.files = state.files.filter(file => file.id !== action.payload);
      })
      .addCase(updateFile.fulfilled, (state, action: PayloadAction<File>) => {
        const index = state.files.findIndex(file => file.id === action.payload.id);
        if (index !== -1) {
          state.files[index] = action.payload;
        }
      })
      .addCase(updateFile.rejected, (state, action) => {
        state.uploadProgress = 0;

        // Извлекаем сообщение об ошибке из структуры response
        if (action.payload && typeof action.payload === 'object') {

          if (action.payload.file && Array.isArray(action.payload.file)) {
            state.error = action.payload.file.join(', ');
          } else {
            state.error = Object.values(action.payload)
              .flat()
              .join(', ');
          }
        } else {
          state.error = action.error.message || 'Ошибка загрузки файла';
        }
      })
      .addMatcher(
        (action) => [
          fetchFiles.pending,
          uploadFile.pending,
          deleteFile.pending
        ].includes(action.type),
          (state) => {
          state.error = null;
        }
      );
    },
  });

export const {
  setUploadProgress,
  updateFileLastDownload,
  clearFileError
} = fileSlice.actions;
export default fileSlice.reducer;
