import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import BarChart from './screens/BarChart';
import Dashboard from './screens/Dashboard';
import Forgot from './screens/Forgot';
import Form from './screens/Form';
import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import Reset from './screens/Reset';

function App() {
  const user = JSON.parse(localStorage.getItem("token"));
  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={<Home />}/>
        {user ? <Route path='/login' element={<Navigate to="/dashboard" replace />} /> :
          <Route path='/login' element={<Login />} />
        }
        {user ? <Route path='/register' element={<Navigate to="/dashboard" replace />} /> :
          <Route path='/register' element={<Register />} />
        }
        <Route path='/forgot' element={<Forgot/>}/>
        <Route path='/reset' element={<Reset/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/dashboard/chart' element={<Dashboard/>}/>
        <Route path='/dashboard/medical' element={<Dashboard/>}/>
        <Route path='/form' element={<Form/>}/>
        <Route path='/chart' element={<BarChart/>}/>
      </Routes>
    </div>
  );
}

export default App;
