import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import defaultpfp from "./0617.png"
import { Divider } from "@mui/material";
import "./Profile.css"
import Button from 'react-bootstrap/Button';
import VideocamIcon from '@mui/icons-material/Videocam';
import WatchModal from './WatchModal';

export default function Profile(props) {
    const { username } = useParams()
    const [playerMap, setPlayerMap] = useState()
    const [duels, setDuels] = useState([])
    const [completedDuels, setCompletedDuels] = useState([])
    const [showWatchModal, setShowWatchModal] = useState(false)
    const [duelToBeWatched ,setDuelToBeWatched] = useState()

    // need player map to map usernames to actual names
    // 

    async function fetchData() {

        const map = await props.fetchPlayerMap();
        setPlayerMap(map)

    }

    // only get duels relating to a player
    async function fetchDuels() {
        const res = await axios.get('/duels/' + username);
        const duels = res.data;
        duels.sort((a,b) => (Date.parse(b.date) - Date.parse(a.date)));
        setDuels(res.data)
        const completed = duels.filter((duel) => (duel.higherEloScore !== undefined) && (duel.lowerEloScore !== undefined))
        setCompletedDuels(completed)

    }

    function getPlayerRank() {

        const players = Array.from(playerMap.values());

        players.sort((a,b) => b.elo - a.elo);
        
        for (let i = 0; i < players.length; i++) {
            const currPlayer = players[i];
            if (currPlayer.username === username) {
                // found user
                return i+1;
            }
        }
        // will never get here, but just adding it for safety
        return 0;

    }

    function handleClickWatch(duel) {
        setShowWatchModal(true)
        setDuelToBeWatched(duel)
    }

    function getPfp(player) {
        if (!player.hasPfp || !process.env.REACT_APP_BLOB_STORAGE_URL) {
            return defaultpfp;
        } else {
            // case has pfp
            return process.env.REACT_APP_BLOB_STORAGE_URL + player.username + "?m=" + Date.now().toString();
        }

    }

    function calculateEloChange(duel, username) {
        if (duel.lowerEloScore === undefined || duel.higherEloScore === undefined ) {
            return ""
        } else {
            // we have scores for both players
            if (duel.lowerEloScore > duel.higherEloScore) {
                // lower elo player won
                if (username == duel.lowerEloUsername[0]) {
                    return " (" + "+" + duel.lowerEloGainPotential + ")"
                } else {
                    // case other player
                    return " (" + "-" + duel.lowerEloGainPotential + ")"
                }
            } else {
                // high elo player won
                if (username == duel.higherEloUsername[0]) {
                    return " (" + "+" + duel.higherEloGainPotential + ")"
                } else {
                    // case other player
                    return " (" + "-" + duel.higherEloGainPotential + ")"
                }

            }
        }
    }

    function userIsWinner(duel, username) {

        const userIsHigherElo = (duel.higherEloUsername.includes(username))
        if (userIsHigherElo) {
            return (duel.higherEloScore > duel.lowerEloScore);
        } else {
            // case user is lower elo
            return (duel.lowerEloScore > duel.higherEloScore);
        }

    }

    function calculateWinRate(duels) {

        // count num games won
        const numGames = duels.length;
        if (numGames == 0) {
            return "N/A"
        } else {
            // case not 0
            let gamesWon = 0;
            duels.forEach((duel) => {
                if (userIsWinner(duel, username)) {
                    gamesWon++;
                }
            })

            const winRate = parseFloat((100*gamesWon / numGames).toFixed(1)).toString();
            return winRate + "%";
        }

        

    }

    function getContainer(duel, username) {
        // if match is still in progress, use in-progress container

        // if user is winner, use victory container

        // else use defeat container
        if (duel.higherEloScore === undefined|| duel.lowerEloScore === undefined) {
            return "in-progress-match-container";
        } else {
            // case match completed
            // determine winner
            return userIsWinner(duel, username) ? "victory-match-container" : "defeat-match-container";
        }

    }

    useEffect(()=> {
        
        if (props) {
            fetchData();
            fetchDuels();
        }
        window.scrollTo(0,0);

    },[props, username])

    return (
        <div className="duels-dashboard-container">
            <div className="profile-header-container">
                {playerMap?<h2 style={{textAlign: "center", color: "white", fontSize: "45px"}}>{playerMap.get(username).name}</h2>:""}
                <div className="profile-header-details-container">
                    {playerMap?<img src={getPfp(playerMap.get(username))} className='match-history-pfp' style={{marginTop: "0.75rem"}}></img>:""}
                    <div className="stats-container">
                        {playerMap?<h3 style={{color: "white", fontSize: "30px"}}>Rank: {getPlayerRank()}</h3>:""}
                        {playerMap?<h3 style={{color: "white", fontSize: "30px"}}>Elo: {playerMap.get(username).elo}</h3>:""}
                        {duels?<h3 style={{color: "white", fontSize: "15px"}}>Total Games Played: {completedDuels.length}</h3>:""}
                        {duels?<h3 style={{color: "white", fontSize: "15px"}}>Win Rate: {calculateWinRate(completedDuels)}</h3>:""}

                    </div>
                    <WatchModal
                        duel={duelToBeWatched}
                        playerMap={playerMap}
                        show={showWatchModal}
                        setShow={setShowWatchModal}
                    />
                    


                </div>
            </div>
            <div className="match-history-container">
                <div className="recent-matches-header">
                    <div className="recent-matches-header-container">
                        <h2 className="recent-matches-label" >Recent Matches </h2>
                    </div>
                    <Divider className="vertical-divider" orientation="vertical" flexItem/>
                    <div className="highlights-header-container">
                        <h2 className="recent-matches-label">Highlights </h2>
                    </div>
                </div>
                <div className="matches-container">
                    {duels && duels.length !== 0 ? duels.map((duel, i) => (
                        <div className={getContainer(duel, username)} key={i}>
                        <div className="new-match-details-container">

                            <div className="match-details-header">
                                {duel.videoUrl?
                                <Button className="match-button" style={{width: "5rem", marginBottom: "0.75rem", marginLeft: "0.5rem"}} variant="dark" onClick={()=>{handleClickWatch(duel)}}>
                                    <VideocamIcon fontSize='medium'/>
                                </Button>
                                :""}
                                <label className="date-label">{duel.date.substring(0,10)}</label>

                                <label className="status-label">{(duel.higherEloScore !== undefined && duel.lowerEloScore !== undefined)?
                                userIsWinner(duel, username) ? "VICTORY" : "DEFEAT"
                                :
                                "IN PROGRESS"}</label>

                            </div>
                            <Divider className="horizontal-divider" orientation="horizontal"/>

                            {duel.isDoublesMatch ?
                                <>
                                    <div className="team-container">
                                        {playerMap?<img src={getPfp(playerMap.get(duel.lowerEloUsername[0]))} className='doubles-match-pfp' style={{marginTop: "0.75rem"}}></img>:""}
                                        {playerMap?<img src={getPfp(playerMap.get(duel.lowerEloUsername[1]))} className='doubles-match-pfp' style={{marginTop: "0.75rem", marginLeft: "0.5rem"}}></img>:""}
                                        {playerMap?<label className="match-label">{playerMap.get(duel.lowerEloUsername[0]).name + " & " + playerMap.get(duel.lowerEloUsername[1]).name + calculateEloChange(duel, duel.lowerEloUsername[0])}</label>:""}
                                        <Divider className="vertical-divider" orientation="vertical" flexItem/>
                                        <div className="score-container">
                                            <label className="score-label">{duel.lowerEloScore}</label>
                                        </div>
                                    </div>
                                    <Divider className="horizontal-divider" orientation="horizontal"/>
                                    <div className="team-container">
                                        {playerMap?<img src={getPfp(playerMap.get(duel.higherEloUsername[0]))} className='doubles-match-pfp' style={{marginTop: "0.75rem"}}></img>:""}
                                        {playerMap?<img src={getPfp(playerMap.get(duel.higherEloUsername[1]))} className='doubles-match-pfp' style={{marginTop: "0.75rem", marginLeft: "0.5rem"}}></img>:""}
                                        {playerMap?<label className="match-label">{playerMap.get(duel.higherEloUsername[0]).name + " & " + playerMap.get(duel.higherEloUsername[1]).name + calculateEloChange(duel, duel.higherEloUsername[0])}</label>:""}
                                        <Divider className="vertical-divider" orientation="vertical" flexItem/>
                                        <div className="score-container">
                                            <label className="score-label">{duel.higherEloScore}</label>
                                        </div>
                                    </div>
                                </>
                            :
                                <>
                                    <div className="team-container">
                                        {playerMap?<img src={getPfp(playerMap.get(duel.lowerEloUsername[0]))} className='match-pfp' style={{marginTop: "0.75rem"}}></img>:""}
                                        {playerMap?<label className="match-label">{playerMap.get(duel.lowerEloUsername[0]).name + calculateEloChange(duel, duel.lowerEloUsername[0])}</label>:""}
                                        <Divider className="vertical-divider" orientation="vertical" flexItem/>
                                        <div className="score-container">
                                            <label className="score-label">{duel.lowerEloScore}</label>
                                        </div>
                                    </div>
                                    <Divider className="horizontal-divider" orientation="horizontal"/>
                                    <div className="team-container">
                                        {playerMap?<img src={getPfp(playerMap.get(duel.higherEloUsername[0]))} className='match-pfp' style={{marginTop: "0.75rem"}}></img>:""}
                                        {playerMap?<label className="match-label">{playerMap.get(duel.higherEloUsername[0]).name + calculateEloChange(duel, duel.higherEloUsername[0])}</label>:""}
                                        <Divider className="vertical-divider" orientation="vertical" flexItem/>
                                        <div className="score-container">
                                            <label className="score-label">{duel.higherEloScore}</label>
                                        </div>
                                    </div>
                                </>
                            }

                        </div>
                    </div>

                    )):""
                    }
                    <div style={{marginTop: "4rem"}}></div>

                </div>
            </div>
        </div>
    
        
    )

}