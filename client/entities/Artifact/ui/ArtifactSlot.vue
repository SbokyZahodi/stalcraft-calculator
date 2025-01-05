<script lang='ts' setup>
import artifacts from '~/../_db/artefacts.json'

const props = defineProps<{
  slotNumber: number
}>()

const { build } = useBuild()

const art = computed({
  get: () => artifacts.find(item => item.id === build.value.artifacts[props.slotNumber]!.id),
  set: (value) => {
    build.value.artifacts[props.slotNumber]!.id = value?.id || null
  },
})

const artLvl = computed({
  get: () => build.value.artifacts[props.slotNumber]!.lvl,
  set: (value) => {
    build.value.artifacts[props.slotNumber]!.lvl = value
  },
})
const artQuality = computed({
  get: () => build.value.artifacts[props.slotNumber]!.quality,
  set: (value) => {
    build.value.artifacts[props.slotNumber]!.quality = value
  },
})

const artAdditional = computed({
  get: () => build.value.artifacts[props.slotNumber]!.additional,
  set: (value) => {
    build.value.artifacts[props.slotNumber]!.additional = value
  },
})

const artCategories = [
  { label: 'Электрофизические', raw: 'electrophysical', icon: 'iconamoon:lightning-2-light', color: 'cyan' },
  { label: 'Термические', raw: 'thermal', icon: 'material-symbols:local-fire-department-rounded', color: 'red' },
  { label: 'Гравитационные', raw: 'gravity', icon: 'file-icons:electron', color: 'yellow' },
  { label: 'Биохимические', raw: 'biochemical', icon: 'streamline:interface-alert-radio-active-3-warning-radioactive-radiation-emergency-danger-safety', color: 'green' },
]

const additional_options = computed(() => {
  return art.value?.additional_stats?.map((stat) => {
    return {
      label: $locale(stat.lines).value,
      value: stat.lines.ru,
      id: stat.id,
    }
  })
})

function removeArtifact(slotNumber: number) {
  build.value.artifacts[slotNumber] = { id: null, lvl: 0, quality: 100, additional: { first: null, second: null, third: null } }
}

function selectArtifact(artifact: IArtifact) {
  build.value.artifacts[props.slotNumber] = { id: artifact.id, lvl: 0, quality: 100, additional: { first: null, second: null, third: null } }
}


// Reset additional stats when artifact is changed
watch(() => art.value?.id, () => {
  artLvl.value = 0
  artQuality.value = 100
  artAdditional.value = { first: null, second: null, third: null }
})

// Reset additional stats when lvl is changed
watch(() => artLvl.value, () => {
  artAdditional.value = { first: null, second: null, third: null }
})

// Get color by artifact rarety
const colorByRarety = computed(() => {
  return getRarety(artQuality.value)
})

const lvls = [
  { label: '0', value: 0 },
  { label: '+5', value: 5 },
  { label: '+10', value: 10 },
  { label: '+15', value: 15 },
]

const category = ref(0)
const searchValue = ref('')

const artifactsBySearch = computed(() => {
  if (searchValue.value) {
    return artifacts.filter(artifact => $locale(artifact.locale).value?.toLowerCase().includes(searchValue.value.toLowerCase()))
  }

  return artifacts.filter(artifact => artCategories.findIndex(category => category.raw === artifact.category) === category.value)
})
</script>

<template>
  <UIPopoverWrapper :popper="{ placement: $device.isMobile ? 'auto' : 'right-start' }">
    <template #trigger>
      <UCard class="p-1.5 w-full bg-dark bg-opacity-60 border" :style="{ borderColor: colorByRarety?.color }">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="size-15 p-2 rounded-xl flex justify-center items-center bg-dark bg-opacity-40">
              <NuxtImg v-if="art?.icon" format="webp" quality="80" placeholder="/preloader.svg" :src="art.icon" />
            </div>

            <div class="md:text-lg text-xs">
              {{ $locale({ ru: art?.locale.ru!, en: art?.locale.en! }) }}
            </div>
          </div>

          <div class="flex justify-between gap-4">
            <UBadge size="lg" variant="soft">
              +{{ artLvl }}
            </UBadge>
            <UBadge size="lg" variant="soft">
              {{ artQuality }}
            </UBadge>
          </div>

          <div class="flex gap-2 absolute -top-2 right-0">
            <LazyTransitionExpand>
              <UBadge v-if="artAdditional.first !== null" size="xs" class="text-10px">
                {{ additional_options?.find((stat) => stat.id === artAdditional?.first)?.label }}
              </UBadge>
            </LazyTransitionExpand>
            <LazyTransitionExpand>
              <UBadge v-if="artAdditional.second !== null" size="xs" class="text-10px">
                {{ additional_options?.find((stat) => stat.id === artAdditional?.second)?.label }}
              </UBadge>
            </LazyTransitionExpand>
            <LazyTransitionExpand>
              <UBadge v-if="artAdditional.third !== null" size="xs" class="text-10px">
                {{ additional_options?.find((stat) => stat.id === artAdditional?.third)?.label }}
              </UBadge>
            </LazyTransitionExpand>
          </div>
        </div>
      </UCard>
    </template>

    <template #panel>
      <div class="p-2 md:w-90">
        <LazyUInput v-model="searchValue" :placeholder="$t('search')" size="lg" icon="i-mdi-magnify" />

        <div class="grid grid-cols-3 gap-2 items-center mt">
          <LazyUTabs
            :default-index="lvls.findIndex(lvl => lvl.value === artLvl)"
            :model-value="lvls.findIndex(lvl => lvl.value === artLvl)"
            class="col-span-2"
            :items="lvls"
            @change="artLvl = lvls[$event]!.value"
          />
          <LazyUInput v-model="artQuality" placeholder="Качество" size="lg" class="relative bottom-1" />
        </div>

        <div v-if="art?.id" class="grid grid-cols-3 gap-1 items-center">
          <LazyUSelectMenu
            v-if="artLvl >= 5 && art?.additional_stats"
            :options="additional_options"
            :model-value="additional_options?.find((stat) => stat.id === artAdditional?.first)?.label ?? ''"
            @change="artAdditional.first = $event.id"
          />
          <LazyUSelectMenu
            v-if="artLvl >= 10 && art?.additional_stats"
            :options="additional_options"
            :model-value="additional_options?.find((stat) => stat.id === artAdditional?.second)?.label ?? ''"
            @change="artAdditional.second = $event.id"
          />
          <LazyUSelectMenu
            v-if="artLvl >= 15 && art?.additional_stats"
            :options="additional_options"
            :model-value="additional_options?.find((stat) => stat.id === artAdditional?.third)?.label ?? ''"
            @change="artAdditional.third = $event.id"
          />
        </div>

        <LazyUTabs v-model="category" :items="artCategories" class="mt" @change="category = $event">
          <template #default="{ item }">
            <UIcon :name="item.icon" class="size-6" :color="item.color" />
          </template>
        </LazyUTabs>

        <div class="overflow-auto p-1 h-70 mt-2">
          <UButton v-for="_art in artifactsBySearch" :key="_art.id" :color="art?.id === _art.id ? 'cyan' : 'gray'" class="flex justify-center w-full block my-2" @click="selectArtifact(_art)">
            {{ $locale(_art.locale) }}
          </UButton>
        </div>

        <UButton v-if="art?.id" class="mt-2 w-full flex justify-center" variant="outline" color="red" @click="removeArtifact(props.slotNumber)">
          {{ $t('remove_artifact') }}
        </UButton>
      </div>
    </template>
  </UIPopoverWrapper>
</template>
