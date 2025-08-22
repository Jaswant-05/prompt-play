import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import './App.css'
import Dashboard from './pages/dashboard'
import Quiz from './pages/Quiz'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/quiz" element={<Quiz/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
