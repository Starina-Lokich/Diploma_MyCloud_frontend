import React, { useEffect, useState } from 'react';
import { FaCopy, FaCheck, FaEdit, FaTimes  } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchFiles } from '../../store/slices/fileSlice';
import {
  formatBytes,
  formatDate,
  handleDelete,
  handleDownload,
  handleRenameMobile,
  handleCommentMobile,
  handlePreview
} from '../../utils/fileUtils';
import { copyToClipboard } from '../../utils/clipboardUtils';
import type { File } from '../../types/fileTypes';
import FileItem from './FileItem';
import { MobileFileItem } from './MobileFileItem';

const FileList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { files, loading, error } = useAppSelector(state => state.files);
  const currentUser = useAppSelector(state => state.auth.user);


  useEffect(() => {
    if (currentUser) {
      dispatch(fetchFiles());
    }
  }, [dispatch, currentUser]);

  if (loading) return <div>Загрузка файлов...</div>;

  return (
    <div>
      {/* Десктопная версия */}
      <div className="desktop-only overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="font-medium">Имя файла</th>
              <th className="font-medium">Комментарий</th>
              <th className="font-medium">Размер</th>
              <th className="font-medium">Дата загрузки</th>
              <th className="font-medium">Последнее скачивание</th>
              <th className="font-medium">Публичная ссылка</th>
              <th className="font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500">
                  Нет загруженных файлов
                </td>
              </tr>
            ) : (
              files.map(file => (
                <FileItem
                  key={file.id}
                  file={file}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Мобильная версия */}
      <div className="mobile-only">
        {files.length === 0 ? (
          <div className="py-6 text-center text-gray-500">
            Нет загруженных файлов
          </div>
        ) : (
          files.map(file => (
            <MobileFileItem key={file.id} file={file} />
          ))
        )}
      </div>
    </div>
  );
};

export default FileList;
