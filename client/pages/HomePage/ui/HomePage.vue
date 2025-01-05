<script lang='ts' setup>
import { SelectArmor } from '~/features/SelectArmor'
import { SelectContainer } from '~/features/SelectContainer'
import { Stats } from '~/widgets/Stats'
import { Container } from '~/widgets/Container'

useHead({
  title: 'Stalcraft Build',
})

const { isMobile } = useDevice()

// Mobile navigation bar
const navigationTabs = [{ label: 'Build', icon: 'file-icons:electron' }, { label: 'Stats', icon: 'nimbus:stats' }]
const currentTab = ref(0)
</script>

<template>
  <nav v-if="isMobile" aria-label="Mobile navigation" class="absolute z-999 left-0 bottom-0 w-screen px-5">
    <UTabs v-model="currentTab" :items="navigationTabs">
      <template #default="{ item }">
        <div class="flex items-center justify-center">
          <UIcon :name="item.icon" class="size-6" />
        </div>
      </template>
    </UTabs>
  </nav>

  <section class="grid lg:grid-cols-3 grid-cols-1 w-full h-full overflow-auto">
    <div v-if="currentTab === 0 || !isMobile" class="lg:border-r b-dark p-5 md:p-10 pb-20 md:pb-10 lg:h-full">
      <div class="flex justify-around">
        <SelectArmor />
        <SelectContainer />
      </div>

      <Container class="mt-8" />
    </div>

    <Stats v-if="currentTab === 1 || !isMobile" class="col-span-2 lg:h-full" />
  </section>
</template>
