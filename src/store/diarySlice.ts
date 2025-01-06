import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadState, saveState } from './localStorage';

export interface DiaryEntry {
  id: string;
  type: 'meal' | 'exercise';
  name: string;
  datetime: string;
  calories: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  duration?: number;
  notes?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface DiaryGoals {
  dailyCalories: number;
  dailyProtein: number;
  dailyFat: number;
  dailyCarbs: number;
}

interface DiaryState {
  entries: DiaryEntry[];
  goals: DiaryGoals;
}

const initialState: DiaryState = loadState()?.diary || {
  entries: [],
  goals: {
    dailyCalories: 2000,
    dailyProtein: 100,
    dailyFat: 70,
    dailyCarbs: 250,
  },
};

const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    addDiaryEntry: (state, action: PayloadAction<DiaryEntry>) => {
      const entryWithTimestamp = {
        ...action.payload,
        createdAt: new Date().toISOString(),
      };
      state.entries.push(entryWithTimestamp);
      saveState({ diary: state });
    },
    updateDiaryEntry: (state, action: PayloadAction<DiaryEntry>) => {
      const index = state.entries.findIndex(entry => entry.id === action.payload.id);
      if (index !== -1) {
        const createdAt = state.entries[index].createdAt;
        state.entries[index] = { ...action.payload, createdAt };
        saveState({ diary: state });
      }
    },
    deleteDiaryEntry: (state, action: PayloadAction<string>) => {
      state.entries = state.entries.filter(entry => entry.id !== action.payload);
      saveState({ diary: state });
    },
    updateGoals: (state, action: PayloadAction<DiaryGoals>) => {
      state.goals = action.payload;
      saveState({ diary: state });
    },
  },
});

export const { addDiaryEntry, updateDiaryEntry, deleteDiaryEntry, updateGoals } = diarySlice.actions;

export default diarySlice.reducer;
