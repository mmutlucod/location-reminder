import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reminderApi } from '../../api/reminder.api';
import { Reminder, CreateReminderRequest } from '../../types';

interface ReminderState {
  reminders: Reminder[];
  currentReminder: Reminder | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReminderState = {
  reminders: [],
  currentReminder: null,
  loading: false,
  error: null,
};

export const fetchReminders = createAsyncThunk(
  'reminder/fetchAll',
  async () => {
    return await reminderApi.getAll();
  },
);

export const fetchReminderById = createAsyncThunk(
  'reminder/fetchById',
  async (id: number) => {
    return await reminderApi.getById(id);
  },
);

export const createReminder = createAsyncThunk(
  'reminder/create',
  async (data: CreateReminderRequest) => {
    return await reminderApi.create(data);
  },
);

export const updateReminder = createAsyncThunk(
  'reminder/update',
  async ({ id, data }: { id: number; data: Partial<CreateReminderRequest> }) => {
    return await reminderApi.update(id, data);
  },
);

export const deleteReminder = createAsyncThunk(
  'reminder/delete',
  async (id: number) => {
    await reminderApi.delete(id);
    return id;
  },
);

export const toggleReminderActive = createAsyncThunk(
  'reminder/toggleActive',
  async ({ id, isActive }: { id: number; isActive: boolean }) => {
    return await reminderApi.toggleActive(id, isActive);
  },
);

const reminderSlice = createSlice({
  name: 'reminder',
  initialState,
  reducers: {
    clearCurrentReminder: state => {
      state.currentReminder = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchReminders.pending, state => {
        state.loading = true;
      })
      .addCase(fetchReminders.fulfilled, (state, action) => {
        state.loading = false;
        state.reminders = action.payload;
      })
      .addCase(fetchReminders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reminders';
      })
      .addCase(fetchReminderById.fulfilled, (state, action) => {
        state.currentReminder = action.payload;
      })
      .addCase(createReminder.fulfilled, (state, action) => {
        state.reminders.push(action.payload);
      })
      .addCase(updateReminder.fulfilled, (state, action) => {
        const index = state.reminders.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.reminders[index] = action.payload;
        }
      })
      .addCase(deleteReminder.fulfilled, (state, action) => {
        state.reminders = state.reminders.filter(r => r.id !== action.payload);
      })
      .addCase(toggleReminderActive.fulfilled, (state, action) => {
        const index = state.reminders.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.reminders[index] = action.payload;
        }
      });
  },
});

export const { clearCurrentReminder } = reminderSlice.actions;
export default reminderSlice.reducer;