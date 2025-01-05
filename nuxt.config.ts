// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@unocss/nuxt',
    '@nuxt/ui',
    '@nuxt/image',
    '@morev/vue-transitions/nuxt',
    '@nuxtjs/seo',
    '@nuxtjs/device',
    '@nuxtjs/i18n',
  ],

  future: {
    compatibilityVersion: 4,
  },

  srcDir: 'client',

  i18n: {
    locales: ['ru', 'en'],
    vueI18n: '~/app/i18n.config.ts',
    defaultLocale: 'ru',
  },

  image: {
    quality: 80,
    formats: ['webp'],
    domains: ['raw.githubusercontent.com'],
  },

  css: ['~/app/global.css'],

  site: {
    name: 'Stalcraft Calculator',
    url: 'https://stalcraft-calculator.vercel.app',
    description: 'Stalcraft Calculator for artifacts',
    defaultLocale: 'ru',
  },

  imports: {
    dirs: [
      'shared/build/*',
      'shared/i18n/*',
      'shared/ui/*',
      // Auto-import all files from shared directory.
    ],
  },

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    storageKey: 'calculator-color-mode',
  },

  dir: {
    pages: 'app/routes',
  },

  components: [
    {
      path: '~/shared',
      pathPrefix: false,
    },
  ],

})
