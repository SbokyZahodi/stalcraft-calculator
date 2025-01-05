<script lang='ts' setup>
import armors from '~/../_db/armor.json'

const category = ref(0)
const searchValue = ref('')

const { build } = useBuild()

const categories = [
  { label: 'боевая', raw: 'combat' },
  { label: 'комбинированная', raw: 'combined' },
  { label: 'научная', raw: 'scientist' },
  { label: 'одежда', raw: 'clothes' },
]

const armor = computed(() => {
  return armors.find(item => item.id === build.value.armor.id)
})

const armorBySearch = computed(() => {
  if (searchValue.value) {
    return armors.filter(armor => $locale(armor.locale).value?.toLowerCase().includes(searchValue.value.toLowerCase()))
  }

  return armors.filter(armor => categories.findIndex(category => category.raw === armor.category) === category.value)
})

const levels = [
  { label: '0', value: 0 },
  { label: '+5', value: 5 },
  { label: '+10', value: 10 },
  { label: '+15', value: 15 },
]
</script>

<template>
  <LazyUIPopoverWrapper :popper="{ placement: 'bottom-end' }">
    <template #trigger>
      <div class="size-30 bg-white backdrop-blur relative rounded-xl flex justify-center items-center bg-opacity-5">
      <NuxtImg v-if="armor?.icon" format="webp" quality="80" placeholder="/preloader.svg" :src="armor.icon" class="size-25" />

      <UBadge v-if="build.armor?.lvl" class="absolute bottom-0 right-0" variant="subtle">
        + {{ build.armor?.lvl }}
        </UBadge>
      </div>
    </template>

    <template #panel>
      <div class="md:w-90 p-2">
        <UInput v-model="searchValue" icon="i-mdi-magnify" size="lg" :placeholder="$t('armor_name')" />

        <!-- Disabled for a while -->
        <!-- <UTabs
          :items="levels"
          :model-value="levels.findIndex(level => level.value === build.armor?.lvl)"
          :default-index="levels.findIndex(level => level.value === build.armor?.lvl)"
          size="sm"
          class="mt-2"
          @change="build.armor.lvl = levels[$event].value"
        /> -->

        <LazyUTabs v-model="category" class="my-2" :items="categories" @change="category = $event">
          <template #default="{ item }">
            <span class="truncate">{{ $locale({ ru: item.label, en: item.raw }) }}</span>
          </template>
        </LazyUTabs>

        <div class="overflow-auto p-1 h-70 mt-2">
          <UButton v-for="arm in armorBySearch" :key="arm.id" :color="build.armor?.id === arm.id ? 'cyan' : 'gray'" class="block w-full my-2" @click="build.armor.id = arm.id">
            {{ $locale(arm.locale) }}
          </UButton>
        </div>
      </div>
    </template>
  </LazyUIPopoverWrapper>
</template>
