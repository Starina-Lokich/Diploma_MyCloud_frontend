import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { uploadFile, clearFileError } from '../../store/slices/fileSlice';

interface FileUploaderProps {
  onClearError: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onClearError }) => {
  const [file, setFile] = useState<File | null>(null);
  const [comment, setComment] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleChange');
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      onClearError();
      dispatch(clearFileError());
    }
  };

  const handleClearError = () => {
    setError(null);
    setFile(null);
    setComment('');
    setProgress(0);
  };

  useEffect(() => {
    handleClearError();
  }, [onClearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Выберите файл для загрузки');
      return;
    }

    setError(null);
    setProgress(0);
    onClearError();
    dispatch(clearFileError());

    const formData = new FormData();
    formData.append('file', file);
    if (comment) formData.append('comment', comment);

    try {
      await dispatch(uploadFile({
        formData,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percentCompleted);
        }
      })).unwrap();

      setFile(null);
      setComment('');
      setProgress(0);
      setError(null);

    } catch (err: any) {
      console.log('Full error object:', err);
      let errorMessage = 'Ошибка загрузки файла';

      const payload = err?.payload || err;
      if (payload && typeof payload === 'object') {

        if (payload.file && Array.isArray(payload.file)) {
          errorMessage = payload.file.join(', ');
        }

        else {
          const messages = Object.values(payload)
            .filter((v) => Array.isArray(v))
            .flat() // объединяем массивы в один
            .join(', ');

          if (messages) {
            errorMessage = messages;
          }
        }
      }
      else if (typeof payload === 'string') {
        errorMessage = payload;
      }
      // если payload не определен
      else if (err.message) {
        errorMessage = err.message;
      }

      if (errorMessage.includes('большой') || errorMessage.includes('размер')) {
        errorMessage = `⚠️ ${errorMessage}`;
      }

      setError(errorMessage);
      setProgress(0);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      {error && (
        <div className={`mb-4 ${
          error.includes('большой') || error.includes('размер') || error.includes('size') || error.includes('large')
            ? 'text-red-600 font-bold text-lg'
            : 'text-red-500'
        }`}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Выберите файл</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Комментарий (необязательно)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows={2}
          />
        </div>

        {file && (
          <div>
            <p>Размер файла: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}

        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded-full">
            <div
              className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!file}
          className={`px-4 py-2 rounded ${
            !file
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Загрузить
        </button>
      </form>
    </div>
  );
};

export default FileUploader;
