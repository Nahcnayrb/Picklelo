import logo from './logo.svg';

import { HashRouter, BrowserRouter } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Sidebar from './components/Sidebar';
import { Routes,Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
// import 'bootstrap/dist/css/bootstrap.css'
import { useState, useEffect} from 'react';
import axios from 'axios';
import Leaderboard from './components/Leaderboard';
import DuelsDashboard from './components/DuelsDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState()

  const token = localStorage.getItem("token")

  function fetchUserData() {
    let data = {
      token: token
    }

    axios.get("/login/authenticate/" + token).then(
        res => {
            let user = res.data
            setUser(user)
        }
    ).catch(
        err => {
            if (err.response.status === 404) {
                console.log("could not fetch user data")
            }
        }
    )

  }

  useEffect(()=> {
    if (token) {
      setIsLoggedIn(true)
      fetchUserData(token)
    }

  },[])





  return (
        <HashRouter>
          <div className="App" id="outer-container">
          <NavigationBar></NavigationBar>
            <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user}/>
            <div id="page-wrap">
            </div>
            <Routes>
                <Route exact path='/' element={<Home/>}/>
                <Route exact path='/login' element={<Login/>}/>
                <Route exact path='/register' element={<Register/>}/>
                <Route exact path ='/players/:username' element={<Profile/>}/>
                <Route exact path ='/leaderboard' element={<Leaderboard/>}/>
                <Route exact path = '/duels' element={<DuelsDashboard/>}/>
              </Routes>
          </div>
        
        </HashRouter>

  );
}

export default App;
