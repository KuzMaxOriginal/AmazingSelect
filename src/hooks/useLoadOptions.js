import {fetchOptions, fetchSelected} from "../common/api.js"
import {PER_PAGE} from "../common/constants.js"

export default ({
  dispatchPage,
  setOptions,
  page,
  setHasNextPage,
  setValues,
  searchQuery,
}) => async (withSelected = false, reset = false, search = null) => {
  if (reset) {
    dispatchPage('reset')
  }

  const options = await fetchOptions(search ?? searchQuery, reset ? 1 : page)

  if (options) {
    if (reset) {
      setOptions(options)
    } else {
      setOptions(items => ([...items, ...options]))
    }

    setHasNextPage(options.length === PER_PAGE)
    dispatchPage('increment')
  }

  if (!withSelected) {
    return
  }

  const selected = await fetchSelected()

  if (selected) {
    const mappedValue = selected
      .map(id => options
        .find(option => option.id === id))

    setValues(mappedValue)
  }
}