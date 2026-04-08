'use client';

import { useAppDispatch, useAppSelector } from './store/store';
import { rehydrate } from './store/features/authSlice';
import { useEffect } from 'react';
import './globals.css';
import ReduxProvider from './store/ReduxProvider';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const isAuthChecked = useAppSelector((state) => state.auth.isAuthChecked);

  useEffect(() => {
    dispatch(rehydrate());
  }, [dispatch]);

  if (!isAuthChecked) {
    return <div>Загрузка...</div>;
  }

  return <>{children}</>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={montserrat.variable}>
        <ReduxProvider>
          <AuthInitializer>{children}</AuthInitializer>
        </ReduxProvider>
      </body>
    </html>
  );
}