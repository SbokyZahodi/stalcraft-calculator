const rareties = [
  { label: 'commo', color: 'transparent', value: 0 },
  { label: 'необычный', color: 'green', value: 1 },
  { label: 'особый', color: 'blue', value: 2 },
  { label: 'редкий', color: 'purple', value: 3 },
  { label: 'исключительный', color: 'red', value: 4 },
  { label: 'легендарный', color: 'gold', value: 5 },
]

export function getRarety(quality: number) {
  switch (true) {
    case quality <= 100: return rareties[0]
    case quality >= 100 && quality <= 109.9: return rareties[1]
    case quality >= 110 && quality <= 119.9: return rareties[2]
    case quality >= 120 && quality <= 129.9: return rareties[3]
    case quality >= 130 && quality <= 139.9: return rareties[4]
    case quality >= 140 && quality <= 149.9: return rareties[5]
    case quality >= 150: return rareties[6]
  }
}
