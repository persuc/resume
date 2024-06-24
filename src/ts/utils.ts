// https://stackoverflow.com/questions/11935175/sampling-a-random-subset-from-an-array
const getRandomSampleSwaps: number[] = []
export function getArraySample<T>(array: T[], size: number): T[] {
  if (size <= 0) {
    return []
  }

  let r
  let i = array.length
  const end = Math.max(0, i - size)

  while (i-- > end) {
    r = Math.floor(Math.random() * (i + 1));
    [array[r], array[i]] = [array[i], array[r]]
    getRandomSampleSwaps.push(i, r)
  }

  var sample = array.slice(end)

  while (size--) {
    i = getRandomSampleSwaps.pop()!
    r = getRandomSampleSwaps.pop()!;
    [array[r], array[i]] = [array[i], array[r]]
  }

  return sample
}

export function removeInPlace<T>(array: T[], condition: (x: T) => boolean): void {
  array.splice(0, array.length, ...array.filter(x => !condition(x)))
}

export function reduceArgs<T>(...args: (T[] | T)[]): T[] {
  return args.reduce(
    (acc: T[], arg: T[] | T) => (acc as T[]).concat(arg),
    <T[]>[]
  )
}

export function chooseRandom<T>(...args: (T[] | T)[]): T {
  const list = reduceArgs(...args)
  if (!list.length) throw new Error('List cannot be empty')
  return list[Math.floor(Math.random() * list.length)]
}

export function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}