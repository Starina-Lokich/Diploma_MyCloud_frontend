import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes  } from 'react-icons/fa';
import type { User } from '../../types/userTypes';
import { formatBytes } from '../../utils/formatUtils';
import { useAppDispatch } from '../../store/hooks';
import { updateUser, deleteUser } from '../../store/slices/userSlice';

interface UserItemProps {
  user: User;
}

const UserItem: React.FC<UserItemProps> = ({ user }) => {
  const [isAdmin, setIsAdmin] = useState(user.is_admin);
  const dispatch = useAppDispatch();

  const handleAdminChange = async () => {
    const newValue = !isAdmin;
    setIsAdmin(newValue);

    try {
      await dispatch(updateUser({
        userId: user.id,
        userData: { is_admin: newValue }
      })).unwrap();
    } catch (err) {
      setIsAdmin(!newValue); // Откат при ошибке
      alert('Ошибка обновления прав доступа');
    }
  };

  const handleDelete = () => {
    if (user.is_admin) {
      alert('Нельзя удалить администратора!');
      return;
    }
    if (window.confirm(`Удалить пользователя ${user.username}?`)) {
      dispatch(deleteUser(user.id));
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="py-2 px-4 border-b">{user.username}</td>
      <td className="py-2 px-4 border-b">{user.email}</td>
      <td>{user.first_name}</td>
      <td>{user.last_name}</td>
      <td className="py-2 px-4 border-b">
        <input
          type="checkbox"
          checked={isAdmin}
          onChange={handleAdminChange}
          className="h-5 w-5"
        />
      </td>
      <td className="py-2 px-4 border-b">{user.file_count}</td>
      <td className="py-2 px-4 border-b">{(user.formatted_total_file_size ?? 0)}</td>

      {/* Действия */}

      <td className="actions-column">
        <div className="relative flex items-center gap-3">
          <Link
            to={`/storage?user=${user.id}`}
            className="text-blue-600 hover:underline"
          >
            Хранилище
          </Link>
          <button
            onClick={handleDelete}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 text-red-600 hover:text-red-800 delete-button"
            title="Удалить пользователя"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserItem;
