import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Provider } from "react-redux";
import { store } from "./store/store";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
    <Notifications position='top-center'/>
    <Provider store={store}>
    <BrowserRouter> 
      <App />
    </BrowserRouter>
    </Provider>
    </MantineProvider>
  </StrictMode>,
)
