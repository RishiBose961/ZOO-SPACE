import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router"
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store.ts'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>

  </StrictMode>,
)
