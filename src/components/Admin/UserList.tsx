import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector,  useAppDispatch } from '../../store/hooks';
import UserItem from './UserItem';
import { formatBytes } from '../../utils/formatUtils';
import { fetchUsers, deleteUser, updateUserAdminStatus } from '../../store/slices/userSlice';


const UserList: React.FC = () => {
  const { users, loading, error } = useAppSelector(state => state.users);
  const dispatch = useAppDispatch();
  console.log('Users:', users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const totalStorageBytes = users.reduce(
    (sum, user) => sum + (user.total_file_size || 0),
    0
  );
  const formattedTotalStorage = formatBytes(totalStorageBytes);

  if (loading) return <div>Загрузка пользователей...</div>;
  if (error) return <div className="text-red-500">Ошибка: {error}</div>;

  return (
    <div>
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Статистика системы</h2>
        <p>Всего пользователей: <span className="font-bold">{users.length}</span></p>
        <p>Общий объем хранилища: <span className="font-bold">{formattedTotalStorage}</span></p>
      </div>

      {/* Десктопная версия */}
      <div className="desktop-only overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Логин</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th className="py-2 px-4 border-b">Администратор</th>
              <th className="py-2 px-4 border-b">Файлов</th>
              <th className="py-2 px-4 border-b">Объем</th>
              <th className="py-2 px-4 border-b">Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <UserItem key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Мобильная версия */}
      <div className="mobile-only">
        {users.map(user => (
          <div key={user.id} className="responsive-card bg-white mb-4">
            <div className="card-row">
              <span className="card-label">Логин:</span>
              <span>{user.username}</span>
            </div>

            <div className="card-row">
              <span className="card-label">Email:</span>
              <span>{user.email}</span>
            </div>

            <div className="card-row">
              <span className="card-label">Имя:</span>
              <span>{user.first_name}</span>
            </div>

            <div className="card-row">
              <span className="card-label">Фамилия:</span>
              <span>{user.last_name}</span>
            </div>

            <div className="card-row">
              <span className="card-label">Администратор:</span>
              <span>{user.is_admin ? 'Да' : 'Нет'}</span>
            </div>

            <div className="card-row">
              <span className="card-label">Файлов:</span>
              <span>{user.file_count}</span>
            </div>

            <div className="card-row">
              <span className="card-label">Объем:</span>
              <span>{user.formatted_total_file_size ?? 0}</span>
            </div>

            <div className="mt-3 flex justify-between">
              <Link
                to={`/storage?user=${user.id}`}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Хранилище
              </Link>
              <button
                onClick={() => dispatch(deleteUser(user.id))}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default UserList;
