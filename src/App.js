import { HashRouter } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Sidebar from './components/Sidebar';
import { Routes,Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import { useState, useEffect} from 'react';
import axios from 'axios';
import Leaderboard from './components/Leaderboard';
import DuelsDashboard from './components/DuelsDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import TournamentDashboard from './components/TournamentDashboard';
import UserProfile from './components/UserProfile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState()
  const [playerMap, setPlayerMap] = useState()
  const [fetchStatus, setFetchStatus] = useState("pending")
  const [duels, setDuels] = useState()

  const token = localStorage.getItem("picklelo-token")

  function fetchUserData() {
    axios.get("/login/authenticate/" + token).then(
        res => {
            let user = res.data
            console.log("Fetched user!")
            setUser(user)
        }
    ).catch(
        err => {
            // if (err.response.status === 404) {
            //     console.log("could not fetch user data")
            // }
        }
    )

  }

  async function fetchPlayerMap() {
    const res = await axios.get("/players")

    let map = new Map();
    res.data.forEach((player) => {
        map.set(player.username, player)
    })
    return map

  }

  async function fetchDuels() {
    const res = await axios.get("/duels")

    let fetchedDuels = res.data
    fetchedDuels.sort(function(a,b){
        return new Date(b.date) - new Date(a.date)
    })
    return fetchedDuels

  }

  async function fetchData() {

    if (token) {
      setIsLoggedIn(true)
      fetchUserData(token)
    }

    try {
      console.log('fetch player map')
      const fetchedPlayerMap = await fetchPlayerMap()
      const fetchedDuels = await fetchDuels()

      setDuels(fetchedDuels)
      setPlayerMap(fetchedPlayerMap)
      console.log('fetch succeeded yay')
      setFetchStatus("fetched")
    } catch (err) {
      console.log('app data fetch failed');
      setFetchStatus("failed")
      // this is to catch the errors that occur if api calls fail
      // if they fail, just let them be since we will retry when the server is ready

    }
  }

  useEffect(() => {
    fetchData()
  },[])




  return (
        <HashRouter>
          <div className="App" id="outer-container">
          <NavigationBar></NavigationBar>
            <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user}/>
            <div id="page-wrap">
            </div>
            <Routes>
                <Route exact path='/' element={<Home fetchData={fetchData} playerMap={playerMap} fetchStatus={fetchStatus}/>}/>
                <Route exact path='/login' element={<Login/>}/>
                <Route exact path='/register' element={<Register/>}/>
                <Route exact path ='/players/:username' element={<Profile fetchPlayerMap={fetchPlayerMap} playerMap={playerMap} fetchStatus={fetchStatus}/>}/>
                <Route exact path ='/leaderboard' element={<Leaderboard playerMap={playerMap} fetchStatus={fetchStatus} />}/>
                <Route exact path ='/tournaments' element={<TournamentDashboard/>}/>
                <Route exact path = '/duels' element={<DuelsDashboard isLoggedIn={isLoggedIn} user={user} fetchPlayerMap={fetchPlayerMap} playerMap={playerMap} fetchStatus={fetchStatus} fetchData={fetchData} duels={duels}/>}/>
                <Route exact path = '/settings' element={<UserProfile user={user} fetchPlayerMap={fetchPlayerMap}/>}/>
              </Routes>
          </div>
        
        </HashRouter>

  );
}

export default App;
