import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import Homepage from './pages/Homepage.tsx'
import Adminpage from './pages/Adminpage.tsx'
import UserProfile from './pages/UserProfile.tsx'
import store from './store.ts'
import { Provider } from 'react-redux'
import { fetchCurrentUser } from './feature/auth/authSlice'

store.dispatch(fetchCurrentUser())

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/homepage' element={<Homepage />} />
        <Route path='/adminpage' element={<Adminpage />} />
        <Route path='/userprofile' element={<UserProfile />} />
      </Routes>
    </Router>
  </Provider>
)