import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import defaultpfp from "../assets/defaultpfp.png";
import { Divider } from "@mui/material";
import "./Profile.css"
import Button from 'react-bootstrap/Button';
import VideocamIcon from '@mui/icons-material/Videocam';
import WatchModal from './WatchModal';
import { Navigate } from "react-router-dom";
import Highlights from './Highlights';

export default function Profile(props) {
    const { username } = useParams()
    const [playerMap, setPlayerMap] = useState()
    const [duels, setDuels] = useState([])
    const [completedDuels, setCompletedDuels] = useState([])
    const [showWatchModal, setShowWatchModal] = useState(false)
    const [duelToBeWatched ,setDuelToBeWatched] = useState()
    const [redirectToHome, setRedirectToHome] = useState(false)
    const [showMatchHistory, setShowMatchHistory] = useState(true)
    const [highlights, setHighlights] = useState([])
    const [clickedPfpUsername, setClickedPfpUsername] = useState("")

    // only get duels relating to a player
    function processDuels() {
        const filteredDuels = props.duels.filter(duel => duel.lowerEloUsername.includes(username) || duel.higherEloUsername.includes(username));
        filteredDuels.sort((a,b) => (Date.parse(b.date) - Date.parse(a.date)));
        setDuels(filteredDuels);
        const completed = filteredDuels.filter((duel) => (duel.higherEloScore !== undefined) && (duel.lowerEloScore !== undefined))
        setCompletedDuels(completed)

    }

    function processHighlights() {
        const filteredHighlights = props.highlights.filter(highlight => highlight.playerUsernames.includes(username));
        setHighlights(filteredHighlights)
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
            return props.pfpMap.get(player.username);
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
            if (duel.higherEloScore === 0 || duel.lowerEloScore === 0) {
                if (userIsWinner(duel, username)) {
                    return "pickled-match-container";
                } else {
                    return "ugly-pickled-match-container";
                }
            } else {
                return userIsWinner(duel, username) ? "victory-match-container" : "defeat-match-container";
            }
        }

    }

    useEffect(()=> {
        
        if (props) {
            if (props.fetchStatus === "failed") {
                setRedirectToHome(true)
            } else if (props.playerMap) {
                setPlayerMap(props.playerMap)
                processDuels();
                processHighlights();
                window.scrollTo(0,0);
            }
        }

    },[props, username])

    if (redirectToHome) {
        return <Navigate to={'/'}/>
    } else if (clickedPfpUsername.length > 0) {
        window.location.href = `/Picklelo/#/players/${clickedPfpUsername}`;
        window.location.reload()
    } else return (
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
                    {showMatchHistory
                    ?
                    <div className="recent-matches-selected-header-container" onClick={()=>{setShowMatchHistory(true)}}>
                        <h2 className="recent-matches-label" >Recent Matches </h2>
                    </div>
                    :
                    <div className="recent-matches-unselected-header-container" onClick={()=>{setShowMatchHistory(true)}}>
                        <h2 className="recent-matches-label" >Recent Matches </h2>
                    </div>
                    }
                    <Divider className="vertical-divider" orientation="vertical" flexItem/>
                    {!showMatchHistory
                    ?
                    <div className="highlights-selected-header-container" onClick={()=>{setShowMatchHistory(false)}}>
                    <h2 className="highlights-label">Highlights</h2>
                    </div>
                    :
                    <div className="highlights-unselected-header-container" onClick={()=>{setShowMatchHistory(false)}}>
                    <h2 className="highlights-label">Highlights </h2>
                </div>
                    
                    }

                </div>
                {showMatchHistory
                ?
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
                                userIsWinner(duel, username) ? "VICTORY" : duel.higherEloScore === 0 || duel.lowerEloScore === 0 ? "PICKLED" : "DEFEAT"
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
                :
                !highlights || !playerMap ? "" :
                    <div className='highlights-container'>

                        <Highlights
                            highlights={highlights}
                            playerMap={playerMap}
                            setClickedPfpUsername={setClickedPfpUsername}
                            getPfp={getPfp}
                            isHighlightsDashboard={true}
                            isLoggedIn={props.isLoggedIn}
                        />

                    </div>
                }
            </div>
        </div>
    
        
    )

}