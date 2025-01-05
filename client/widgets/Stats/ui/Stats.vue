<script lang='ts' setup>
import { calculateBuild } from '~/shared/packages/artifact-calculation'

const { build } = useBuild()

const visibilityOptions = reactive({
  armorEnabled: true,
  containerEnabled: true,
})

const stats = computed(() => {
  return calculateBuild(build.value, visibilityOptions)
})

const calculated_HP = computed(() => {
  const bulletResistance = stats.value.get('Bullet resistance')?.value ?? 0
  const vitality = stats.value.get('Vitality')?.value ?? 0

  return (100 + bulletResistance) / 100 * (100 + vitality)
})

function isStatNegative(stat: [string, number]): boolean {
  const isNegative = negativeStats.includes(stat[0])
  const isPositive = stat[1] < 0

  if (isNegative && stat[1] > 0)
    return true

  else if (isNegative && stat[1] < 0)
    return false

  if (isPositive && stat[1] < 0)
    return true

  return false
}
</script>

<template>
  <div class="md:p-20 overflow-auto px-5 py-10">
    <div class="flex justify-end gap-4">
      <UButton :variant="visibilityOptions.armorEnabled ? 'solid' : 'outline'" icon="i-mdi-shield" class="w-20 flex justify-center" @click="visibilityOptions.armorEnabled = !visibilityOptions.armorEnabled" />
      <UButton :variant="visibilityOptions.containerEnabled ? 'solid' : 'outline'" icon="fluent:backpack-48-regular" class="w-20 flex justify-center" @click="visibilityOptions.containerEnabled = !visibilityOptions.containerEnabled" />
    </div>

    <UCard v-if="stats.size" class="my p-3 border border-yellow-500">
      <p>
        {{ $t('total_hp') }} {{ calculated_HP.toFixed(2) }}
      </p>
    </UCard>

    <TransitionExpand group>
      <UCard v-for="(stat, index) in stats" :key="stat[0]" class="my p-3 border border-transparent" :class="[{ 'border-dark-1': index % 2 === 0 }, { '!border-red': isStatNegative([stat[0], stat[1].value]) }]">
        <p class="text-green" :class="{ 'text-red': isStatNegative([stat[0], stat[1].value]) }">
          {{ $locale(stat[1].locale) }} {{ stat[1].value.toFixed(2) }}
        </p>
      </UCard>
    </TransitionExpand>
  </div>
</template>
