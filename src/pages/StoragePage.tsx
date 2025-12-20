import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import type { TypedUseSelectorHook } from 'react-redux';
import { FaBan } from 'react-icons/fa';
import type { RootState } from '../store/store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFiles, clearFileError } from '../store/slices/fileSlice';
import api from '../utils/apiUtils';
import FileList from '../components/Storage/FileList';
import FileUploader from '../components/Storage/FileUploader';
import type { User } from '../types/userTypes';


const StoragePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector(state => state.auth);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('user');

  const { error } = useAppSelector(state => state.files);

  const isCurrentUser = !userId || (currentUser && currentUser.id === (userId));

  // console.log('Current user:', currentUser, 'Selected user ID:', userId, 'Is current user:', isCurrentUser);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(clearFileError());

      if (userId) {
        try {
          const response = await api.get(`/auth/users/${userId}/`);
          setSelectedUser(response.data as User);
          console.log('Selected user:', response.data);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      }
      dispatch(fetchFiles(userId ? parseInt(userId) : undefined));
    };
    fetchData();
  }, [dispatch, userId]);

  const handleClearError = () => {
    dispatch(clearFileError());
  };

  useEffect(() => {
    const loadFiles = async () => {
      try {
        await dispatch(fetchFiles(userId ? parseInt(userId) : undefined));
      } catch (err) {
        console.error('Failed to load files:', err);
      }
    };
    loadFiles();
  }, [dispatch, userId]);


  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <h1 className="text-xl md:text-2xl font-bold mb-4">
        {isCurrentUser ? 'Мое хранилище' : 'Хранилище пользователя'}
      </h1>

      {userId && selectedUser && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 shadow-sm">

          {/* Десктопная версия */}
          <div className="desktop-only flex items-start space-x-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-600">
                {selectedUser.last_name} {selectedUser.first_name}
                <span className="ml-2 text-gray-300 text-base font-normal">
                  (@{selectedUser.username})
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                <div className="flex items-center">
                  <span className="font-medium mr-2">Email:</span>
                  <span className="text-gray-700">{selectedUser.email}</span>
                </div>

                <div className="flex items-center">
                  <span className="font-medium mr-2">Статус:</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    selectedUser.is_admin
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {selectedUser.is_admin ? ' Администратор' : ' Пользователь'}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="font-medium mr-2">Использовано:</span>
                  <span className="text-gray-700 font-medium">
                    {selectedUser.formatted_total_file_size}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Мобильная версия */}
          <div className="mobile-only user-info-mobile">
            <h2 className="text-lg font-semibold text-center">
              {selectedUser.last_name} {selectedUser.first_name}
              <span className="ml-2 text-gray-300 text-sm">
                (@{selectedUser.username})
              </span>
            </h2>

            <div className="mt-3 space-y-2">
              <div className="text-center">
                <span className="font-medium">Email:</span>
                <span className="ml-2">{selectedUser.email}</span>
              </div>

              <div className="text-center">
                <span className="font-medium">Статус:</span>
                <span className={`ml-2 px-2.5 py-1 rounded-full text-xs font-medium ${
                  selectedUser.is_admin
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  {selectedUser.is_admin ? ' Администратор' : ' Пользователь'}
                </span>
              </div>

              <div className="text-center">
                <span className="font-medium">Использовано:</span>
                <span className="ml-2 font-medium">
                  {selectedUser.formatted_total_file_size}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}


      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Кнопка сброса ошибки */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 text-red-700 px-6 py-4">
              <span className="text-red-400 mr-3 text-xl">⛔</span>
              <div> Ошибка загрузки файлов </div>
              <button
                onClick={handleClearError}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Сбросить ошибку
              </button>
          </div>
        )}

        {isCurrentUser && (
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Загрузка нового файла</h2>
            <FileUploader onClearError={handleClearError}/>
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {isCurrentUser ? 'Мои файлы' : 'Файлы пользователя'}
            </h2>

          </div>
          <FileList />
        </div>
      </div>

    </div>
  );
};

export default StoragePage;
