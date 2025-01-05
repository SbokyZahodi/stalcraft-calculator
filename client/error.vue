<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError,
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <NuxtLayout>
    <div class="flex flex-col items-center justify-center h-screen">
      <UCard class="flex flex-col items-center justify-center p-20 backdrop-blur-3xl bg-black/30">
        <h2 class="text-4xl font-bold text-center">
          {{ error?.statusCode }}
        </h2>

        <DevOnly>
          <h3 class="text-2xl font-bold text-center">
            {{ error?.message }}
          </h3>
        </DevOnly>

        <div class="flex justify-center w-full">
          <UButton class="mt" color="gray" variant="ghost" @click="handleError">
            {{ $t('back_to_home') }}
          </UButton>
        </div>
      </UCard>
    </div>
  </NuxtLayout>
</template>
