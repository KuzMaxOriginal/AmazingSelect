import AmazingSelect from "./components/AmazingSelect.jsx"

import './App.scss'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

function App() {
  return (
    <>
      <AmazingSelect
        label="Выберите город"
        loading="Загрузка..."
        noOptionsText="Не найдено"
      />
    </>
  )
}

export default App
