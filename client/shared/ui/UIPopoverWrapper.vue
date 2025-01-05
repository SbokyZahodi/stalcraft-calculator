<script setup lang="ts">
const { isMobile } = useDevice()
const isModalOpened = ref(false)
</script>

<template>
  <UPopover v-if="!isMobile" v-model:open="isModalOpened">
    <slot name="trigger" />

    <template #panel>
      <slot name="panel" />
    </template>
  </UPopover>

  <div v-else>
    <div class="relative" @click="isModalOpened = true">
      <slot name="trigger" />
    </div>
    <UModal v-model="isModalOpened">
      <div>
        <slot name="panel" />
      </div>
    </UModal>
  </div>
</template>
