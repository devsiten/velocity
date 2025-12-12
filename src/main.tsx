import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { WalletProvider } from './components/WalletProvider';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletProvider>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#12121a',
            color: '#ffffff',
            border: '1px solid #2a2a3a',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#00ff88',
              secondary: '#0a0a0f',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff4444',
              secondary: '#0a0a0f',
            },
          },
        }}
      />
    </WalletProvider>
  </React.StrictMode>
);
