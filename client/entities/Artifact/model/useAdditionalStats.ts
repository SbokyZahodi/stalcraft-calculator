export default (art?: IArtifactSlot) => {
  const additional_options = computed(() => {
    return art?.item?.additional_stats.map(stat => stat.lines.ru)
  })



  function reset() {
    art!.additional.first = ''
    art!.additional.second = ''
    art!.additional.third = ''
  }

  // Reset additional stats when artifact is changed
  watch(() => art?.item, () => {
    reset()
  })

  // Reset additional stats when lvl is changed
  watch(() => art?.lvl, () => {
    reset()
  })

  watch(() => art?.additional_stats, () => {
    console.log(art?.additional_stats)
  })

  return {
    additional_options,
    additional_stats,
  }
}
