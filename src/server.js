import 'dotenv/config'
import cors from "cors"
import express from 'express'
import {OPTIONS, PER_PAGE} from "./common/constants.js"

const optionList = OPTIONS.map((option, index) => ({
  id: index + 1,
  label: option,
}))

const optionMap = Object.fromEntries(optionList.map(item => [item.id, item]));

let selectedList = []

const getFilteredOptions = (search) => optionList.filter(item => item.label.toLowerCase()
  .includes(search.toLowerCase()))

const app = express()
const port = process.env.VITE_PORT
app.use(cors())

app.get('/selected-options', (req, res) => {
  res.send(selectedList.map(id => optionMap[id]))
})

app.get('/options/:page?', (req, res) => {
  let options = optionList

  const search = req.query?.search
  if (search) {
    options = getFilteredOptions(search)
  }

  const page = req.params?.page || 1
  const start = (page - 1) * PER_PAGE
  const end = page * PER_PAGE
  let sliced = options.slice(start, end)

  res.send(sliced)
})

app.get('/update-selected/', (req, res) => {
  const ids = req.query?.ids
  let selected = []

  if (ids) {
    selected = ids.split(',').map(Number)
  }

  selectedList = selected

  res.send({
    status: 'success',
  })
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
