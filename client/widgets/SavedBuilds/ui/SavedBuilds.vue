<script setup lang="ts">
import { useSavedBuilds } from '../model'
import _artifacts from '~/../_db/artefacts.json'

const { state, saveBuild, removeBuild, applyBuild } = useSavedBuilds()

// Save builds to localStorage after change
watch(() => state.value.builds, () => {
  localStorage.setItem('savedBuilds', JSON.stringify(state.value.builds))
}, { deep: true })

const { build } = useBuild()
const { t } = useI18n()

</script>

<template>
  <USlideover v-model="state.isModalOpened" side="left" class="z-9999">
    <div class="p-4">
      <div class="flex justify-between items-center">
        <UButton class="flex justify-center items-center" size="lg" @click="saveBuild(build)">
          {{ t('save_current_build') }}
        </UButton>

        <UButton icon="i-mdi-close" size="lg" color="red" variant="outline" @click="state.isModalOpened = false" />
      </div>

      <div class="p-1 overflow-auto mt-4 max-h-[calc(100vh-120px)]">
        <TransitionExpand group>
          <UCard v-for="_build in state.builds" :key="_build.id" class="p-5 my-2 relative">
            <p class="text-lg mb-1">
              {{ _build.title }}
            </p>

            <div class="absolute top-4 right-4 flex gap-2">
              <UButton icon="i-mdi-delete" color="red" variant="outline" class="size-8 flex justify-center items-center" @click="removeBuild(_build.id)" />

              <UButton icon="i-mdi-play" variant="outline" class="size-8 flex justify-center items-center" @click="applyBuild(_build.id)" />
            </div>

            <div class="grid gap-2 grid-cols-6">
              <NuxtImg v-for="art in _build.artifacts.filter(art => art.id)" :key="art.id!" format="webp" quality="60" :style="{ borderColor: getRarety(art.quality)?.color }" class="size-10 my-1 border rounded-xl" :src="_artifacts.find(a => a.id === art.id)?.icon" />
            </div>
          </UCard>
        </TransitionExpand>
      </div>
    </div>
  </USlideover>
</template>
