import { readFile, writeFile } from 'node:fs/promises'

interface IFields {
  data: string
  icon: string
  name: {
    type: string
    key: string
    args: object
    lines: {
      ru: string
      en: string
    }
  }
}

/** Prepare database */
export async function prepareDB() {
  console.warn('Preparing database...')

  const allItems = await (await fetch('https://raw.githubusercontent.com/EXBO-Studio/stalcraft-database/main/ru/listing.json')).json() as IFields[]

  const stalcraftDBURl = 'https://raw.githubusercontent.com/EXBO-Studio/stalcraft-database/main/ru'

  const items = new Set()

  for (const field of allItems) {
    if ((field.data.includes('armor') || field.data.includes('artefact') || field.data.includes('container')) && !field.data.includes('armor/device'))
      items.add(`${stalcraftDBURl}/${field.data}`)
  }

  const promises = [...items].map(item => fetch(item as string).then(res => res.json()))

  const data = await Promise.all(promises)

  const armor = data.filter(item => item.category.includes('armor') && !item.category.includes('device')).map((armor) => {
    interface Element {
      type: string
      name: {
        lines: {
          ru: string
          en: string
        }
      }
      value: number
    }

    // Список параметров, которые нужно исключить
    const excludeParams = [
      'Вес',
      'Прочность',
      'Макс. прочность',
      'Ранг',
      'Класс',
      'Эффективность',
    ]

    // Собираем все параметры из всех блоков
    const values = armor.infoBlocks
      .flatMap((block: any) => block.elements || [])
      .filter((element: Element) =>
        element.type === 'numeric'
        && element.name?.lines
        && !excludeParams.includes(element.name.lines.ru),
      )
      .map((element: Element) => ({
        name: {
          ru: element.name.lines.ru,
          en: element.name.lines.en,
        },
        value: Number(element.value),
      }))

    return {
      id: armor.id,
      icon: `${stalcraftDBURl}/icons/${armor.category}/${armor.id}.png`,
      category: armor.category.split('/')[1],
      locale: {
        ru: armor.name.lines.ru,
        en: armor.name.lines.en,
      },
      values,
    }
  }).filter(Boolean)

  const additionalStats = await readFile('./_db/additional_stats.json', 'utf-8')

  const additionalStatsData = JSON.parse(additionalStats)

  const artifacts = data.filter(item => item.category.includes('artefact')).map((artifact) => {
    interface Element {
      type: string
      name: {
        lines: {
          ru: string
          en: string
        }
      }
      max?: number
      min?: number
      value?: number
    }

    // Список параметров, которые нужно исключить
    const excludeParams = [
      'Заряд',
      'Макс. заряд',
      'Срабатывает при',
      'Снижает урон на',
      'Перезарядка',
      'Заряда за активацию',
      'Качество',
      'Вес',
    ]

    // Собираем все параметры из всех блоков
    const values = artifact.infoBlocks
      .flatMap((block: any) => block.elements || [])
      .filter((element: Element) =>
        element.name?.lines
        && !excludeParams.includes(element.name.lines.ru)
        && (element.max !== undefined || element.min !== undefined || element.value !== undefined),
      )
      .map((element: Element) => ({
        name: {
          ru: element.name.lines.ru,
          en: element.name.lines.en,
        },
        value: {
          max: element.max || element.value || 0,
          min: element.min || element.value || 0,
        },
      }))
      .filter(Boolean)

    return {
      id: artifact.id,
      category: artifact.category.split('/')[1],
      icon: `${stalcraftDBURl}/icons/${artifact.category}/${artifact.id}.png`,
      locale: {
        ru: artifact.name.lines.ru,
        en: artifact.name.lines.en,
      },
      values,
      additional_stats: additionalStatsData.find((stat: any) => stat.lines.ru === artifact.name.lines.ru)?.additional_stats,
    }
  })

  const containers = data.filter(item => item.category.includes('container')).map((container) => {
    interface ContainerElement {
      type: string
      name: {
        type: string
        key: string
        args: object
        lines: {
          ru: string
          en: string
        }
      }
      value: number
      formatted?: {
        value: {
          ru: string
          en: string
        }
        nameColor: string
        valueColor: string
      }
    }

    const getContainerStats = (container: any) => {
      let capacity = 0
      let protection = 0
      const values: Array<{
        name: {
          lines: {
            ru: string
            en: string
          }
        }
        value: number
      }> = []

      for (const block of container.infoBlocks) {
        if (!block?.elements)
          continue

        const elements = block.elements as ContainerElement[]

        for (const el of elements) {
          if (!el.name?.lines?.ru)
            continue

          const ruName = el.name.lines.ru

          if (ruName === 'Вместимость') {
            capacity = Number(el.value)
          }
          else if (ruName === 'Внутренняя защита') {
            protection = Number(el.value)
          }
          else if (!['Вес', 'Эффективность', 'Ранг', 'Класс'].includes(ruName)) {
            values.push({
              name: {
                lines: {
                  ru: el.name.lines.ru,
                  en: el.name.lines.en,
                },
              },
              value: el.value,
            })
          }
        }
      }

      return { capacity, protection, values }
    }

    const stats = getContainerStats(container)

    return {
      id: container.id,
      icon: `${stalcraftDBURl}/icons/containers/${container.id}.png`,
      category: container.category.split('/')[1],
      name: {
        lines: {
          ru: container.name.lines.ru,
          en: container.name.lines.en,
        },
      },
      protection: stats.protection,
      capacity: stats.capacity,
      values: stats.values,
    }
  })

  await writeFile('./_db/armor.json', JSON.stringify([...armor], null, 2))
  await writeFile('./_db/artefacts.json', JSON.stringify([...artifacts], null, 2))
  await writeFile('./_db/containers.json', JSON.stringify([...containers], null, 2))

  console.warn('Database ready')
}

prepareDB()
