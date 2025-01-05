export default function calculateArtStats(
  art: IArtifactSlot,
  val: { name: { ru: string, en: string }, value: { min: number, max: number } },
) {
  const rarety = getRarety(art.quality)

  const { min, max } = val.value
  const buff = min + (min / 100) * (art.quality - 100)
  const buffByMin = min + (max / 100) * (art.quality - 100)
  const buffByMax = max + (min / 100) * (art.quality - 100)
  const mind = max * 0.9
  const extraQuality = art.quality - (100 + 10 * (rarety?.value || 0))
  const isNegative = negativeStats.includes(val.name.en)

  // Quality <= 100
  if (art.quality <= 100) {
    // Negative stats
    if (isNegative) {
      if (max > 0) {
        return buffByMax + (buffByMax / 100)
      }
      else {
        return buffByMin + (buffByMin / 100) * (art.lvl * 2)
      }
    }

    if (max > 0) {
      return buffByMax + (buffByMax / 100) * (art.lvl * 2)
    }
    else {
      return buffByMin + (buffByMin / 100)
    }
  }
  // Quality > 100
  else {
    if (isNegative) {
      if (max > 0) {
        return max + ((max - mind) / 100) * (extraQuality * 10)
      }
      else {
        return buff + (buff / 100) * (art.lvl * 2)
      }
    }
    else {
      if (max > 0) {
        const baseValue = max + (max / 100) * (art.quality - 100)
        return baseValue + (baseValue / 100) * (art.lvl * 2)
      }
      else {
        return min + ((max - mind) / 100) * (extraQuality * 20)
      }
    }
  }
}
