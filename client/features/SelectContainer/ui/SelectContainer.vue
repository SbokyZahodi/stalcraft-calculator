<script lang='ts' setup>
import containers from '../../../../_db/containers.json'

const searchValue = ref('')

const { build } = useBuild()

const container = computed(() => {
  return containers.find(item => item.id === build.value.container_id)
})

const containersBySearch = computed(() => {
  return containers.filter(container => container.name.lines.ru.toLowerCase().includes(searchValue.value.toLowerCase()))
})
</script>

<template>
  <LazyUIPopoverWrapper>
    <template #trigger>
      <div class="size-30 bg-white backdrop-blur rounded-xl flex justify-center items-center bg-opacity-5">
        <NuxtImg v-if="container?.icon" format="webp" quality="80" placeholder="/preloader.svg" :src="container.icon" class="size-25" />
      </div>
    </template>

    <template #panel>
      <div class="md:w-90 p-2">
        <UInput v-model="searchValue" size="lg" icon="i-mdi-magnify" :placeholder="$t('container_name')" />

        <div class="overflow-auto p-1 h-80 mt-2">
          <UButton v-for="cont in containersBySearch" :key="cont.id" :color="build.container_id === cont.id ? 'cyan' : 'gray'" class="block w-full my-2" @click="build.container_id = cont.id">
            {{ $locale(cont.name.lines) }}
          </UButton>
        </div>
      </div>
    </template>
  </LazyUIPopoverWrapper>
</template>
