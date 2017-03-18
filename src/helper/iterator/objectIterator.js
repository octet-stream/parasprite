function* objectIterator(iterable) {
  const keys = Object.keys(iterable)

  for (const key of keys) {
    const val = iterable[key]

    yield [key, val]
  }
}

export default objectIterator
