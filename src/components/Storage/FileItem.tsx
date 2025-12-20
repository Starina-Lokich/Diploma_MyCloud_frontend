import React, { useState } from 'react';
import { FaCopy, FaCheck, FaEdit, FaTimes  } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  deleteFile,
  downloadFile,
  updateFile,
  previewFile
} from '../../store/slices/fileSlice';
import {
  handleDownload,
  handleDelete,
  handleRename,
  handleCommentUpdate,
  handlePreview,
  formatBytes,
  formatDate,
} from '../../utils/fileUtils';
import { copyToClipboard } from '../../utils/clipboardUtils';
import type { File } from '../../types/fileTypes';


interface FileItemProps {
  file: File;
}

const FileItem: React.FC<FileItemProps> = ({ file }) => {
  const dispatch = useAppDispatch();
  const [copied, setCopied] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(file.original_name);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [newComment, setNewComment] = useState(file.comment);
  const [copyError, setCopyError] = useState<string | null>(null);

  const onRename = async () => {
    await handleRename(
      dispatch,
      file.id,
      newName,
      setIsRenaming,
      setNewName
    );
  };

  const onCommentUpdate = async () => {
    await handleCommentUpdate(
      dispatch,
      file.id,
      newComment,
      setIsEditingComment,
      setNewComment
    );
  };

  const onDownload = () => handleDownload(dispatch, file.id, file.original_name);
  const onDelete = () => handleDelete(dispatch, file.id);

  const onPreview = async () => {
  try {
    const url = await handlePreview(dispatch, file.id);
    window.open(url, '_blank');
  } catch (err) {
    alert('Ошибка предпросмотра');
  }
};


  const copyPublicLink = async () => {
    //const publicUrl = `${window.location.origin}/api/storage/public/${file.public_link}/`;
    // Используем encodeURIComponent для обработки спецсимволов
    const encodedLink = encodeURIComponent(file.public_link);
    const publicUrl = `${window.location.origin}/api/storage/public/${encodedLink}/`;

    // navigator.clipboard.writeText(publicUrl);
    // setCopied(true);
    // setTimeout(() => setCopied(false), 2000);

    // костыльный способ копирования ссылки:
    // Создаем временный элемент для копирования

    try {
      // Используем асинхронный вызов
      const success = await copyToClipboard(publicUrl);

      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        setCopyError('Не удалось скопировать ссылку');
        setTimeout(() => setCopyError(null), 3000);
      }
    } catch (err) {
      console.error('Copy error:', err);
      setCopyError('Ошибка при копировании');
      setTimeout(() => setCopyError(null), 3000);
    }
  };

  return (
    <tr className="hover:bg-blue-50 transition-colors duration-150">
      {/* Имя файла */}
      <td>
        {isRenaming ? (
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border rounded p-1 mr-2 flex-grow"
            />
             <div className="flex items-center space-x-2">
              <button
                onClick={onRename}
                className="bg-green-500 text-white px-2 py-1 rounded flex items-center"
              >
                <FaCheck className="mr-1" />
              </button>
              <button
                onClick={() => setIsRenaming(false)}
                className="bg-gray-300 text-gray-700 px-2 py-1 rounded flex items-center"
              >
                <FaTimes className="mr-1" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="truncate overflow-hidden pr-2 max-w-[200px]">
              {file.original_name}
            </div>
            <button
              onClick={() => setIsRenaming(true)}
              className="ml-auto text-blue-500 hover:text-blue-700 flex-shrink-0"
            >
              <FaEdit />
            </button>
          </div>
        )}
      </td>

      {/* Комментарий */}
      <td className="min-w-[200px] max-w-[300px]">
        {isEditingComment ? (
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="border rounded p-1 mr-2 flex-grow"
            />
            <div className="flex items-center space-x-2">
              <button
                onClick={onCommentUpdate}
                className="bg-green-500 text-white px-2 py-1 rounded flex items-center"
              >
                <FaCheck className="mr-1" />
              </button>
              <button
                onClick={() => setIsEditingComment(false)}
                className="bg-gray-300 text-gray-700 px-2 py-1 rounded flex items-center"
              >
                <FaTimes className="mr-1" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div
              className="truncate overflow-hidden pr-2 flex-grow"
              title={file.comment}
            >
              {file.comment || 'Нет комментария'}
            </div>
            <button
              onClick={() => setIsEditingComment(true)}
              className="ml-2 text-blue-500 hover:text-blue-700 flex-shrink-0"
            >
              <FaEdit />
            </button>
          </div>
        )}
      </td>

      {/* Размер файла, дата загрузки и последнего скачивания */}
      <td>{formatBytes(file.size)}</td>
      <td className="whitespace-nowrap">{formatDate(file.upload_date)}</td>
      <td className="whitespace-nowrap">
        {file.last_download ? formatDate(file.last_download) : 'еще не скачивался'}
      </td>

      {/* Публичная ссылка */}
      <td>
        <div className="flex items-center justify-between">
          <div className="text-blue-600 break-all mr-2 truncate max-w-xs">
            {file.public_link.toString().slice(0, 20)}...
          </div>
          <button
            onClick={copyPublicLink}
            className="text-blue-500 hover:text-blue-700 ml-auto"
            title="Скопировать публичную ссылку"
          >
            {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
          </button>
          {copyError && (
            <div className="text-red-500 text-xs mt-1">
              {copyError}
            </div>
          )}
        </div>
      </td>

      {/* Действия */}
      <td className="actions-column">
        <div className="flex flex-col space-y-2">
          <button
            onClick={onDownload}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Скачать
          </button>
          <button
            onClick={onPreview}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            Просмотреть
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Удалить
          </button>
        </div>
      </td>
    </tr>
  );
};

export default FileItem;
