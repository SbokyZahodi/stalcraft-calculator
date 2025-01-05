export default function calculateAdditionalStats(
  art: IArtifactSlot,
  val: IArtifactAdditional,
) {
  const { min, max } = val.value || { min: 0, max: 0 }
  const minBuff = min + ((max - min) / 100) * art.quality
  const maxBuff = max + (max / 100) * (art.quality - 100)
  const negativeBuff = min + (min / 100) * (art.quality - 100)
  const isNegative = negativeStats.includes(val.lines.en)

  if (art.quality >= 100) {
    if (isNegative && max < 0) {
      return negativeBuff + (negativeBuff / 100) * (art.lvl * 2)
    }
    else {
      return maxBuff + (maxBuff / 100) * (art.lvl * 2)
    }
  }

  return minBuff + (minBuff / 100) * (art.lvl * 2)
}
