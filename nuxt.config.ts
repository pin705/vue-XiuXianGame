// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@element-plus/nuxt',
    '@pinia/nuxt',
    'nuxt-mongoose',
    'nuxt-auth-utils',
  ],

  // Pinia configuration
  pinia: {
    storesDirs: ['./stores/**'],
  },

  ssr: false,

  // Mongoose configuration
  mongoose: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/xiuxian-game',
    options: {},
    modelsDir: 'models',
    devtools: true,
  },

  // Runtime config for environment variables
  runtimeConfig: {
    // Private keys (server-only)
    mongodbUri: process.env.MONGODB_URI,
    authSecret: process.env.AUTH_SECRET || 'default-secret-change-in-production',
    
    // Public keys (exposed to client)
    public: {
      apiBase: '/api',
    },
  },

  // Element Plus auto-import
  elementPlus: {
    /** Options */
  },

  // Tailwind CSS
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config',
  },

  // App configuration
  app: {
    head: {
      title: 'Tôi tu tiên bằng chữ nghĩa, toàn là nhờ spam thôi!',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'Không thiên phú, không sư phụ, chỉ có cái bàn phím là bạn tu hành!' 
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
    },
  },

  // CSS
  css: [
    'normalize.css/normalize.css',
    'element-plus/dist/index.css',
    '~/assets/css/styles.css',
    '~/assets/css/game-styles.css',
  ],

  // Vite configuration
  // vite: {
  //   resolve: {
  //     alias: {
  //       '@': '/src',
  //     },
  //   },
  // },

  // Nitro server configuration
  // nitro: {
  //   preset: 'node-server',
  // },
});
