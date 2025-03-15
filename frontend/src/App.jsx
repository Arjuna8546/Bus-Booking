
import './App.css'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import AddBusDetail from './pages/admin/AddBusDetail'
import AdminHome from './pages/admin/AdminHome'
import AdminLogin from './pages/admin/Login'
import {Route,BrowserRouter as Router,Routes} from "react-router-dom"

function App() {


  return (
    <>
    <Router>
      <Routes>
      <Route path='/signup' element={<SignUp/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/' element={<HomePage/>}></Route>
      <Route path='/admin/login' element={<AdminLogin/>}></Route>
      <Route path='/admin' element={<AdminHome/>}></Route>
      <Route path='/add-bus' element={<AddBusDetail/>}></Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
