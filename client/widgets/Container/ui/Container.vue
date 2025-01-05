<script lang='ts' setup>
import { ArtifactCard } from '~/entities/Artifact'
import { useSavedBuilds } from '~/widgets/SavedBuilds'

const { build, clear } = useBuild()
const { state: savedBuildsState } = useSavedBuilds()

watch(build, () => {
  useRouter().push({ query: { build: JSON.stringify({ ...build.value, artifacts: build.value.artifacts.filter(art => art.id) }) } })
}, { deep: true })
</script>

<template>
  <div>
    <div class="flex gap-2">
      <UButton variant="outline" color="red" @click="clear">
        {{ $t('clear_container') }}
      </UButton>

      <UButton variant="outline" @click="savedBuildsState.isModalOpened = true">
        {{ $t('my_builds') }}
      </UButton>
    </div>

    <div class="mt-5">
      <template v-for="(art, index) in build.artifacts" :key="art.id">
        <ArtifactCard :slot-number="index" class="my" />
      </template>
    </div>
  </div>
</template>
