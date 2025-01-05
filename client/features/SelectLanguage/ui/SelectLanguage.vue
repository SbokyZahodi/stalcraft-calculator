<script lang="ts" setup>
const { setLocale, locale } = useI18n()
</script>

<template>
  <USelectMenu :model-value="locale" :options="['ru', 'en']" class="w-20" size="md" @update:model-value="setLocale($event)" />
</template>
