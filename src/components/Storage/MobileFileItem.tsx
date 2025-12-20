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

export const MobileFileItem: React.FC<{ file: File }> = ({ file }) => {
  const dispatch = useAppDispatch();
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const handleCopy = async () => {
    const encodedLink = encodeURIComponent(file.public_link);
    const publicUrl = `${window.location.origin}/api/storage/public/${encodedLink}/`;

    try {
      const success = await copyToClipboard(publicUrl);

      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        setCopyError(false);
      } else {
        setCopyError(true);
        setTimeout(() => setCopyError(false), 3000);
      }
    } catch (err) {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    }
  };

  return (
    <div className="responsive-card bg-white mb-4 rounded-lg shadow">
      {/* Имя файла с кнопкой редактирования */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-black-800">Имя файла:</span>
        <div className="flex items-center">
          <span className="truncate max-w-[120px]">{file.original_name}</span>
          <button
            onClick={() => handleRenameMobile(dispatch, file)}
            className="ml-2 text-blue-500 hover:text-blue-700"
          >
            <FaEdit size={14} />
          </button>
        </div>
      </div>

      {/* Комментарий с кнопкой редактирования */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-700">Комментарий:</span>
        <div className="flex items-center">
          <span className="truncate max-w-[120px]">
            {file.comment || 'Нет комментария'}
          </span>
          <button
            onClick={() => handleCommentMobile(dispatch, file)}
            className="ml-2 text-blue-500 hover:text-blue-700"
          >
            <FaEdit size={14} />
          </button>
        </div>
      </div>

      {/* Остальные поля */}
      <div className="grid grid-cols-2 gap-2">
        <div className="card-row">
          <span className="font-semibold text-gray-700">Размер:</span>
          <span>{formatBytes(file.size)}</span>
        </div>

        <div className="card-row">
          <span className="font-semibold text-gray-700">Загружен:</span>
          <span>{formatDate(file.upload_date)}</span>
        </div>

        <div className="card-row">
          <span className="font-semibold text-gray-700">Скачивание:</span>
          <span>{file.last_download ? formatDate(file.last_download) : 'еще не скачивался'}</span>
        </div>

        {/* Публичная ссылка */}
        <div className="card-row">
          <span className="font-semibold text-gray-700">Ссылка:</span>
          <div className="flex items-center">
            <span className="font-semibold text-gray-700 truncate max-w-[100px]">
              {file.public_link.toString().slice(0, 20)}...
            </span>
            <button
              onClick={handleCopy}
              className="ml-2 text-blue-500 relative"
              title="Скопировать ссылку"
            >
              {copied
                ? <FaCheck className="text-green-500" size={14} />
                : <FaCopy size={14} />
              }
              {copyError && (
                <span className="absolute -top-6 -left-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded whitespace-nowrap">
                  Ошибка копирования
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="mt-3 flex justify-between">
        <button onClick={() => handleDownload(dispatch, file.id, file.original_name)} className="bg-blue-500 text-white px-3 py-1 rounded">
          Скачать
        </button>
        <button
          onClick={async () => {
            try {
              const url = await handlePreview(dispatch, file.id);
              window.open(url, '_blank');
            } catch (err) {
              alert('Ошибка предпросмотра');
            }
          }}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Просмотреть
        </button>
        <button onClick={() => handleDelete(dispatch, file.id)} className="bg-red-500 text-white px-3 py-1 rounded">
          Удалить
        </button>
      </div>
    </div>
  );
};
