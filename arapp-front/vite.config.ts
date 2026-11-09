import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'prompt',
            devOptions: {
                enabled: true,
            },
            includeAssets: ['favicon.svg', ' apple-touch-icon-180x180.png', 'maskable-icon-512x512.png'],
            manifest: {
                name: 'Arappka - Arabski pod ręką!',
                short_name: 'Arappka',
                description: 'Aplikacja do nauki pisma i języka arabskiego',
                theme_color: '#f8f9fa',
                background_color: '#f8f9fa',
                display: 'standalone',
                start_url: '/',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'maskable-icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    }
                ]
            }
        })
    ],
    server: {
        host: "0.0.0.0",
        watch: {
            usePolling: true,
        },
    },
})
