import { Middleware } from '@reduxjs/toolkit';
import { saveState } from './localStorage';

export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  // Сохраняем все состояние целиком
  saveState(state);

  return result;
};
