'use client';

import { useAppDispatch } from './store/store';
import { rehydrate } from './store/features/authSlice';
import { useEffect } from 'react';
import './globals.css';
import ReduxProvider from './store/ReduxProvider';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <HtmlWithRehydrate>{children}</HtmlWithRehydrate>
    </ReduxProvider>
  );
}

function HtmlWithRehydrate({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(rehydrate());
  }, [dispatch]);

  return (
    <html lang="ru">
      <body className={montserrat.variable}>{children}</body>
    </html>
  );
}