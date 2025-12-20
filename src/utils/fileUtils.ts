import type { Dispatch } from '@reduxjs/toolkit';
import type { AnyAction } from '@reduxjs/toolkit';
import type { AppDispatch } from '../store/store';
import type { File } from '../types/fileTypes';
import { deleteFile, downloadFile, updateFile, previewFile } from '../store/slices/fileSlice';

// Функция для создания безопасного имени файла
const sanitizeFileName = (fileName: string): string => {
  // Удаляем диакритические знаки и заменяем спецсимволы
  return fileName
    .normalize('NFD') // Разбиваем акцентированные символы
    .replace(/[\u0300-\u036f]/g, '') // Удаляем диакритические знаки
    .replace(/[^\w\d\.\-]/g, '_') // Заменяем опасные символы
    .replace(/\s+/g, '_'); // Заменяем пробелы на подчеркивания
};


// Функции для Redux-операций
export const handleDownload = async (
  dispatch: AppDispatch,
  fileId: string,
  fileName: string
) => {
  try {
    // безопасное имя файла
    const safeFileName = sanitizeFileName(fileName);

    const response = await dispatch(downloadFile({ fileId, fileName })).unwrap();

    // временная ссылку для скачивания
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', safeFileName);

    // Добавляем атрибут для обхода блокировки Chrome
    link.setAttribute('data-safe-download', 'true');

    document.body.appendChild(link);
    link.click();

    // Очистка ресурсов
    setTimeout(() => {
      if (link.parentNode) link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (err) {
    console.error('Download error:', err);
    alert('Ошибка при скачивании файла');
  }
};

export const handleDelete = (dispatch: Dispatch, fileId: string) => {
  if (window.confirm('Вы уверены?')) {
    dispatch(deleteFile(fileId) as any);
  }
};

export const handleRename = async (
  dispatch: AppDispatch,
  fileId: string,
  newName: string,
  setIsRenaming: React.Dispatch<React.SetStateAction<boolean>>,
  setNewName: React.Dispatch<React.SetStateAction<string>>,
) => {
  if (newName.trim() === '') {
    alert('Имя файла не может быть пустым');
    return;
  }
  try {
    const resultAction = await dispatch(updateFile({ fileId, updatedData: { original_name: newName } }) as unknown as AnyAction);
    if ('unwrap' in resultAction && typeof resultAction.unwrap === 'function') {
      await resultAction.unwrap();
    }
    setIsRenaming(false);
  } catch (err) {
    alert('Ошибка переименования');
  }
};

export const handleCommentUpdate = async (
  dispatch: Dispatch,
  fileId: string,
  newComment: string,
  setIsEditingComment: React.Dispatch<React.SetStateAction<boolean>>,
  setNewComment: React.Dispatch<React.SetStateAction<string>>,
) => {
  try {
    await dispatch(updateFile({ fileId, updatedData: { comment: newComment } })).unwrap();
    setIsEditingComment(false);
  } catch (err) {
    alert('Ошибка обновления комментария');
  }
};

export const handlePreview = async (
  dispatch: Dispatch,
  fileId: string,
): Promise<string> => {
  try {
    const url = await dispatch(previewFile({ fileId })).unwrap();
    return url; // Возвращаем URL
  } catch (err) {
    throw new Error('Ошибка предпросмотра');
  }
};

export const handleRenameMobile = async (
  dispatch: AppDispatch,
  file: File
) => {
  const newName = prompt('Введите новое имя файла:', file.original_name);
  if (newName && newName.trim() !== '') {
    await dispatch(updateFile({
      fileId: file.id,
      updatedData: { original_name: newName }
    }));
  }
};

export const handleCommentMobile = async (
  dispatch: AppDispatch,
  file: File
) => {
  const newComment = prompt('Введите комментарий:', file.comment || '');
  if (newComment !== null) {
    await dispatch(updateFile({
      fileId: file.id,
      updatedData: { comment: newComment }
    }));
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};
