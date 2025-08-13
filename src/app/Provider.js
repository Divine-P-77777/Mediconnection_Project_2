'use client';

import React from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import  { persistor,store } from '@/store/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Provider({ children }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <ToastContainer />
          {children}
        </AuthProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
