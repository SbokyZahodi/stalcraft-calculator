<script lang='ts' setup>
import { SelectLanguage } from '~/features/SelectLanguage'
import { SavedBuilds } from '~/widgets/SavedBuilds'
</script>

<template>
  <Head>
    <Link rel="apple-touch-icon" sizes="57x57" href="favicon/apple-icon-57x57.png" />
    <Link rel="apple-touch-icon" sizes="60x60" href="favicon/apple-icon-60x60.png" />
    <Link rel="apple-touch-icon" sizes="72x72" href="favicon/apple-icon-72x72.png" />
    <Link rel="apple-touch-icon" sizes="76x76" href="favicon/apple-icon-76x76.png" />
    <Link rel="apple-touch-icon" sizes="114x114" href="favicon/apple-icon-114x114.png" />
    <Link rel="apple-touch-icon" sizes="120x120" href="favicon/apple-icon-120x120.png" />
    <Link rel="apple-touch-icon" sizes="144x144" href="favicon/apple-icon-144x144.png" />
    <Link rel="apple-touch-icon" sizes="152x152" href="favicon/apple-icon-152x152.png" />
    <Link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-icon-180x180.png" />
    <Link rel="icon" type="image/png" sizes="192x192" href="favicon/android-icon-192x192.png" />
    <Link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png" />
    <Link rel="icon" type="image/png" sizes="96x96" href="favicon/favicon-96x96.png" />
    <Link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png" />
    <Link rel="manifest" href="favicon/manifest.json" />
    <Meta name="msapplication-TileColor" content="#ffffff" />
    <Meta name="msapplication-TileImage" content="favicon/ms-icon-144x144.png" />
    <Meta name="theme-color" content="#ffffff" />
  </Head>

  <main>
    <NuxtImg src="/background.png" alt="background" preload class="w-full z-2 h-full object-cover fixed left-0 top-0 pointer-events-none select-none" />
    <LazyUNotifications class="md:w-120 z-99999" />
    <ClientOnly>
      <SavedBuilds />
    </ClientOnly>

    <div class="absolute top-0 right-0 z-9999 flex gap-2 m-2">
      <SelectLanguage />
      <NuxtLink target="_blank" to="https://github.com/SbokyZahodi/stalcraft-calculator">
        <UButton class="z-9999 size-9 flex justify-center items-center" color="gray" icon="i-mdi-github" />
      </NuxtLink>
    </div>

    <div class="text-white backdrop-blur z-3 overflow-auto fixed left-0 top-0 w-screen h-screen">
      <slot />
    </div>
  </main>
</template>
