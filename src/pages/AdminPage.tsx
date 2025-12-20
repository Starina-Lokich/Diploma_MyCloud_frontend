import React, { useEffect } from 'react';
import UserList from '../components/Admin/UserList';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUsers } from '../store/slices/userSlice';
import type { RootState } from '../store/store';
import type { User } from '../types/userTypes';

const AdminPage: React.FC = () => {
  const dispatch = useAppDispatch();
  interface AuthState {
    user: User | null;
  }

  const { user } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user?.is_admin) {
      dispatch(fetchUsers());
    }
  }, [dispatch, user]);

  if (!user?.is_admin) {
    return <div>Доступ запрещен</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        Администрирование ({user?.username})
      </h1>
      <UserList />
    </div>
  );
};

export default AdminPage;
