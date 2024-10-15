import 'dotenv/config'
import cors from "cors"
import express from 'express'
import {OPTIONS, PER_PAGE} from "./common/constants.js"

const optionList = OPTIONS.map((option, index) => ({
  id: index + 1,
  label: option,
}))

let selectedList = []

const getFilteredOptions = (search) => optionList.filter(item => item.label.toLowerCase()
  .includes(search.toLowerCase()))

const app = express()
const port = process.env.VITE_PORT
app.use(cors())

app.get('/selected-options', (req, res) => {
  res.send(selectedList)
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
  const ids = req.query?.ids?.split(',')
  selectedList = ids.map(Number)

  res.send({
    status: 'success',
    selected: selectedList,
  })
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
