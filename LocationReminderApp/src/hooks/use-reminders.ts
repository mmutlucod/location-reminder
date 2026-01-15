import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import {
  fetchReminders,
  fetchReminderById,
  createReminder,
  updateReminder,
  deleteReminder,
  toggleReminderActive,
} from '../store/slices/reminder.slice';
import { CreateReminderRequest } from '../types';

export const useReminders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reminders, currentReminder, loading, error } = useSelector(
    (state: RootState) => state.reminder,
  );

  const fetchAll = () => {
    return dispatch(fetchReminders()).unwrap();
  };

  const fetchById = (id: number) => {
    return dispatch(fetchReminderById(id)).unwrap();
  };

  const create = (data: CreateReminderRequest) => {
    return dispatch(createReminder(data)).unwrap();
  };

  const update = (id: number, data: Partial<CreateReminderRequest>) => {
    return dispatch(updateReminder({ id, data })).unwrap();
  };

  const remove = (id: number) => {
    return dispatch(deleteReminder(id)).unwrap();
  };

  const toggleActive = (id: number, isActive: boolean) => {
    return dispatch(toggleReminderActive({ id, isActive })).unwrap();
  };

  return {
    reminders,
    currentReminder,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    toggleActive,
  };
};