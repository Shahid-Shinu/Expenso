import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MantineProvider } from '@mantine/core';
import { Provider } from "react-redux";
import { store } from "./store/store";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider theme={{ colorScheme: 'light' }} withGlobalStyles withNormalizeCSS>
    <Provider store={store}>
      <App />
    </Provider>
    </MantineProvider>
  </StrictMode>,
)
