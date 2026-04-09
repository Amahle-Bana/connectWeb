'use client';

import { Provider } from 'react-redux';
import { store } from '../redux';
import { AuthProvider } from './auth-context';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </Provider>
    );
} 