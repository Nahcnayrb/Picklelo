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
import HighlightsDashboard from './components/HighlightsDashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState()
  const [playerMap, setPlayerMap] = useState()
  const [fetchStatus, setFetchStatus] = useState("pending")
  const [duels, setDuels] = useState()
  const [pfpMap, setPfpMap] = useState()
  const [highlights, setHighlights] = useState()

  const token = localStorage.getItem("picklelo-token")

  function fetchUserData() {
    axios.get("/login/authenticate/" + token).then(
        res => {
            let user = res.data
            setUser(user)
        }
    ).catch(
        err => {
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

  async function fetchHighlights() {
    const res = await axios.get("/highlights");

    let fetchedHighlights = res.data;
    fetchedHighlights.sort(function(a,b) {
      return new Date(b.date) - new Date(a.date)
    });
  
    setHighlights(fetchedHighlights);
  }

  async function fetchPfps(playerUsernames) {

    const currPfpMap = new Map();

    for (let i = 0; i < playerUsernames.length; i++) {
      const username = playerUsernames[i];
      const response = await fetch(process.env.REACT_APP_BLOB_STORAGE_URL + username);
      const file = await response.blob();
      const fileLocalUrl = URL.createObjectURL(file)
      currPfpMap.set(username, fileLocalUrl);
    }
    setPfpMap(currPfpMap);
  }

  async function fetchData() {

    if (token) {
      setIsLoggedIn(true)
      fetchUserData(token)
    }

    try {
      const fetchedPlayerMap = await fetchPlayerMap()
      // filter out players with pfps
      const players = Array.from(fetchedPlayerMap.values());
      const playersWithPfps = players.filter(player => player.hasPfp === true );
      const playerNamesWithPfps = playersWithPfps.map(player => player.username);
      await fetchPfps(playerNamesWithPfps)
      await fetchHighlights()
      const fetchedDuels = await fetchDuels()

      setDuels(fetchedDuels)
      setPlayerMap(fetchedPlayerMap)
      // setPfpMap(fetchedPfpMap)
      setFetchStatus("fetched")
    } catch (err) {
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
                <Route exact path ='/players/:username' element={<Profile fetchPlayerMap={fetchPlayerMap} playerMap={playerMap} fetchStatus={fetchStatus} pfpMap={pfpMap} duels={duels} highlights={highlights}/>}/>
                <Route exact path ='/leaderboard' element={<Leaderboard playerMap={playerMap} fetchStatus={fetchStatus} pfpMap={pfpMap}/>}/>
                <Route exact path ='/tournaments' element={<TournamentDashboard/>}/>
                <Route exact path = '/duels' element={<DuelsDashboard isLoggedIn={isLoggedIn} user={user} playerMap={playerMap} fetchStatus={fetchStatus} fetchData={fetchData} duels={duels} pfpMap={pfpMap}/>}/>
                <Route exact path = '/settings' element={<UserProfile user={user} fetchPlayerMap={fetchPlayerMap} fetchData={fetchData} pfpMap={pfpMap}/>}/>
                <Route exact path='/highlights' element={<HighlightsDashboard  isLoggedIn={isLoggedIn} user={user} playerMap={playerMap} fetchStatus={fetchStatus} fetchData={fetchData} highlights={highlights} pfpMap={pfpMap} />}></Route>
              </Routes>
          </div>
        
        </HashRouter>

  );
}

export default App;
