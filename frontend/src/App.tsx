import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import './App.css'
import Dashboard from './pages/dashboard'
import Quiz from './pages/Quiz'
import Verify from './pages/verify'
import Reset from './pages/Reset'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/quiz" element={<Quiz/>}/>
        <Route path="/verify" element={<Verify/>}/>
        <Route path="/reset-password" element={<Reset/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
