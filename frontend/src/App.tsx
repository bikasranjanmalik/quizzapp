import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import CreateQuiz from './components/CreateQuiz'
import TakeQuiz from './components/TakeQuiz'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<CreateQuiz />} />
        <Route path="/quiz/:id" element={<TakeQuiz />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
