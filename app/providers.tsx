'use client';

import { Provider } from 'react-redux';
import { store } from '../redux';
import { AuthProvider } from '../context/auth-context';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '../redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
        },
    },
});

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        // Redux Provider
        <Provider store={store}>
            {/* Redux Presistance Provider */}
            <PersistGate loading={null} persistor={persistor}>
                {/* Authentication Provider */}
                <AuthProvider>
                    {/* TanStack Query Provider */}
                    <QueryClientProvider client={queryClient}>
                        {children}
                    </QueryClientProvider>
                </AuthProvider>
            </PersistGate>
        </Provider>
    );
} 