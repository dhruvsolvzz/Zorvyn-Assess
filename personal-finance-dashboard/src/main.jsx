import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toast } from '@base-ui/react/toast';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Toast.Provider>
          <App />
          <Toast.Portal>{/* Viewport is rendered inside App via ToastViewport component */}</Toast.Portal>
        </Toast.Provider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);

