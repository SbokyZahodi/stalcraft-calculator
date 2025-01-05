interface ISavedBuild extends IBuild {
  id: string
  title: string
}

interface ISavedBuilds {
  builds: ISavedBuild[]
  isModalOpened: boolean
}

export default () => {
  const state = useState<ISavedBuilds>('savedBuilds', () => ({
    builds: [],
    isModalOpened: false,
  }))

  const { build } = useBuild()
  const { t } = useI18n()

  function saveBuild(build: IBuild) {
    // Check if container is empty
    if (build.artifacts.every(art => !art.id)) {
      useToast().add({
        title: t('build_empty'),
        color: 'red',
      })

      return
    }

    if (state.value.builds.length >= 5) {
      useToast().add({
        title: t('max_builds_reached'),
        color: 'red',
      })

      return
    }

    const buildClone = structuredClone(toRaw(build))

    state.value.builds.push({
      ...buildClone,
      id: crypto.randomUUID(),
      title: `Build ${state.value.builds.length + 1}`,
    })
  }

  function removeBuild(id: string) {
    state.value.builds = state.value.builds.filter(b => b.id !== id)

    useToast().add({
      title: t('build_removed'),
      color: 'red',
    })
  }

  function applyBuild(id: string) {
    const _build = structuredClone(toRaw(state.value.builds.find(b => b.id === id)))

    if (!_build) {
      console.error('Build not found')
      return
    }

    build.value = {
      armor: _build.armor,
      artifacts: _build.artifacts,
      container_id: _build.container_id,
    }

    state.value.isModalOpened = false

    useToast().add({
      title: t('build_applied'),
      color: 'green',
    })
  }

  // Load builds from localStorage
  callOnce(() => {
    state.value.builds = JSON.parse(localStorage.getItem('savedBuilds') || '[]')
  })

  return {
    state,
    saveBuild,
    removeBuild,
    applyBuild,
  }
}
