'use client';

import React from 'react';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '@/store/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '@/hooks/useAuth';
import GlobalLoaderWrapper from './components/GlobalLoaderWrapper';
import { useServerStatus } from "@/hooks/useServerStatus";
import ServerDown from "@/components/common/ServerDown";

const InnerApp = ({ children }) => {
  const serverDown = useServerStatus();

  if (serverDown) return <ServerDown />;

  return (
    <AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <GlobalLoaderWrapper>{children}</GlobalLoaderWrapper>
    </AuthProvider>
  );
};

// 🧩 Step 2: Main exported provider
export function Provider({ children }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <InnerApp>{children}</InnerApp>
      </PersistGate>
    </ReduxProvider>
  );
}
