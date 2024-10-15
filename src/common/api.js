import axios from "axios"

const API_URL = `http://localhost:${import.meta.env.VITE_PORT}`

export async function fetchSelected() {
  try {
    const res = await axios.get(`${API_URL}/selected-options`)

    return res.data
  } catch (e) {
    console.error(e)
  }
}

export async function fetchOptions(search, page = 1) {
  try {
    const res = await axios.get(`${API_URL}/options/${page}`, {
      params: {
        search: search || undefined,
      }
    })

    return res.data
  } catch (e) {
    console.error(e)
  }
}

export async function updateSelectedOptions(ids) {
  try {
    const res = await axios.get(`${API_URL}/update-selected`, {
      params: { ids: ids.join(',') },
    })

    return res.data
  } catch (e) {
    console.error(e)
  }
}