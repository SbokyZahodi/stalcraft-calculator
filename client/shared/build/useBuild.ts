export interface IArtifactSlot {
  id: string | null
  lvl: number
  quality: number
  additional: {
    first: number | null
    second: number | null
    third: number | null
  }
}

export interface IArmorSlot {
  id: string | null
  lvl: number
}

export interface IBuild {
  container_id: string | null
  armor: IArmorSlot
  artifacts: IArtifactSlot[]
}

function CreateDefaultArtifact(): IArtifactSlot {
  return {
    id: null,
    lvl: 0,
    quality: 100,
    additional: {
      first: null,
      second: null,
      third: null,
    },
  }
}

export default () => {
  const { t } = useI18n()

  const build = useState<IBuild>('build', () => {
    return {
      container_id: null,
      armor: {
        id: null,
        lvl: 0,
      },
      artifacts: Array(6).fill(null).map(() => CreateDefaultArtifact()),
    }
  })

  function clear() {
    build.value = {
      ...build.value,
      artifacts: build.value.artifacts.map(art => ({ ...art, id: null, lvl: 0, quality: 100, additional: { first: null, second: null, third: null } })),
    }

    useToast().add({
      title: t('container_cleared'),
      color: 'cyan',
    })
  }

  // Init build from query
  callOnce(() => {
    if (useRoute().query.build) {
      const buildQuery = JSON.parse(useRoute().query.build as string) as IBuild

      build.value = {
        ...buildQuery,
        // Take artefacts from query and fill with default artefacts if not present
        artifacts: [...buildQuery.artifacts, ...Array(6 - buildQuery.artifacts.length).fill(null).map(() => CreateDefaultArtifact())],
      }
    }
  })

  return {
    build,
    clear,
  }
}
