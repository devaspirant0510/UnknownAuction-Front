import { createRoot } from 'react-dom/client';
import React from 'react';
import '@app/index.css';
import { App } from '@/app';

async function enableMocking() {
    // if (import.meta.env.VITE_MODE === "development") {
    //     await worker.start()
    //
    // }
}

createRoot(document.getElementById('root')).render(<App />);
