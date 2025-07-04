import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.tsx';
import { ThemeProvider } from '@/components/theme-provider.tsx';
import { CookiesProvider } from "react-cookie";
import '@/assets/styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <CookiesProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <App />
            </ThemeProvider>
        </CookiesProvider>
    </React.StrictMode>
);
