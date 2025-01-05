import calculateArtStats from './calculateArtStats'
import calculateAdditionalStats from './calculateAdditionalStats'
import type { IBuild } from '~/shared/build/useBuild'
import _armors from '~/../_db/armor.json'
import _artifacts from '~/../_db/artefacts.json'
import _containers from '~/../_db/containers.json'

interface IOptions {
  armorEnabled: boolean
  containerEnabled: boolean
}

export default (build: IBuild, options: IOptions = { armorEnabled: true, containerEnabled: true }) => {
  const total_stats = new Map<string, { locale: { ru: string, en: string }, value: number }>()

  const armor = _armors.find(armor => armor.id === build.armor.id)
  const container = _containers.find(container => container.id === build.container_id)

  // 1. Calculate artifact stats
  build.artifacts.forEach((art) => {
    const artItem = _artifacts.find(artifact => art.id === artifact.id)

    if (!artItem)
      return

    artItem.values.forEach((val) => {
      const exist = total_stats.get(val.name.en)?.value || 0
      total_stats.set(val.name.en, {
        locale: val.name,
        value: exist + calculateArtStats(art, val),
      })
    })

    const first_additional = artItem?.additional_stats?.find(item => item.id === art.additional.first)
    const second_additional = artItem?.additional_stats?.find(item => item.id === art.additional.second)
    const third_additional = artItem?.additional_stats?.find(item => item.id === art.additional.third)

    // 2. Additional stats
    const additionalStats = [first_additional, second_additional, third_additional]
    additionalStats
      .filter(Boolean)
      .forEach((stat) => {
        const existing = total_stats.get(stat?.lines.en || '')?.value || 0
        total_stats.set(stat?.lines.en || '', {
          locale: { ru: stat?.lines.ru || '', en: stat?.lines.en || '' },
          value: existing + calculateAdditionalStats(art, stat),
        })
      })
  })

  // 3. Calculate container protection
  if (options.containerEnabled) {
    total_stats.forEach((stat, key) => {
      if (negativeStats.includes(key)) {
        total_stats.set(key, {
          ...stat,
          value: stat.value - (stat.value / 100) * (container?.protection || 0),
        })
      }
    })
  }

  // 4. Container stats
  if (options.containerEnabled) {
    container?.values.forEach((val) => {
      const key = val.name.lines.en
      const exist = total_stats.get(key)?.value || 0
      total_stats.set(key, {
        locale: { ru: val.name.lines.ru, en: val.name.lines.en },
        value: exist + val.value,
      })
    })
  }

  // 5. Armor stats
  if (options.armorEnabled) {
    armor?.values?.forEach((val) => {
      if (!val.value)
        return

      const key = val.name.en

      // Здесь должна быть крутая формула расчета ПУ на броне с учетом ЛВЛа, но я её не знаю
      if (val.name.en === 'Bullet resistance') {
        const currentValue = total_stats.get(key)?.value || 0

        total_stats.set(key, {
          locale: val.name,
          value: currentValue + val.value,
        })

        return
      }

      const exist = total_stats.get(key)?.value || 0
      total_stats.set(key, {
        locale: val.name,
        value: exist + val.value,
      })
    })
  }

  return total_stats
}
