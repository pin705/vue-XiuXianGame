import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import vitePluginBundleObfuscator from 'vite-plugin-bundle-obfuscator';
import { VitePWA } from 'vite-plugin-pwa';


export default defineConfig({
    base: './',
    build: {
        minify: 'terser',
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules')) return 'vendor';
                },
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith('.ico')) return '[name].[ext]';
                    return 'assets/[ext]/[name]-[hash].[ext]';
                }
            }
        },
        terserOptions: {
            compress: {
                drop_console: false,
                drop_debugger: true
            }
        }
    },
    plugins: [
        vue(),
        tailwindcss(),
        Icons({
            autoInstall: true
        }),
        VitePWA({
            manifest: {
                name: 'Tôi tu tiên bằng chữ nghĩa, toàn là nhờ spam thôi!',
                icons: [
                    {
                        src: '/icons/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/icons/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ],
                short_name: 'Tu tiên gõ phím!',
                description: 'Không thiên phú, không sư phụ, chỉ có cái bàn phím là bạn tu hành!',
                theme_color: '#141414'
            },
            devOptions: {
                enabled: true
            },
            registerType: 'autoUpdate'
        }),
        AutoImport({
            resolvers: [
                IconsResolver({
                    prefix: 'Icon'
                }),
                ElementPlusResolver()
            ]
        }),
        Components({
            resolvers: [
                IconsResolver({
                    enabledCollections: ['ep']
                }),
                ElementPlusResolver()
            ]
        }),
        vitePluginBundleObfuscator({
            log: false,
            enable: true,
            options: {
                log: false,
                compact: true,
                stringArray: true,
                renameGlobals: false,
                selfDefending: false,
                debugProtection: false,
                rotateStringArray: true,
                deadCodeInjection: false,
                stringArrayEncoding: ['none'],
                disableConsoleOutput: true,
                stringArrayThreshold: 0.75,
                controlFlowFlattening: false,
                unicodeEscapeSequence: true,
                identifierNamesGenerator: 'hexadecimal'
            },
            excludes: ['router.js'],
            autoExcludeNodeModules: true
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    logLevel: 'error'
});
