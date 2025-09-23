import DuelsModal from "./DuelsModal";
import { useState, useEffect} from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import DeleteIcon from '@mui/icons-material/Delete';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import "./DuelsDashboard.css"
import { Divider } from "@mui/material";
import defaultpfp from "./0617.png"
import DuelsScoreboard from "./DuelsScoreboard";
import DeleteDuelModal from "./DeleteDuelModal";
import { Navigate } from "react-router-dom";
import VideocamIcon from '@mui/icons-material/Videocam';
import EditIcon from '@mui/icons-material/Edit';
import WatchModal from "./WatchModal";
import EditModal from "./EditModal";

export default function DuelsDashboard(props) {

    const [showModal, setShowModal] = useState(false)
    const [players, setPlayersData] = useState([])
    const [duels, setDuels] = useState()
    const [playerMap, setPlayerMap] = useState()
    const [showScoreboard, setShowScoreboard] = useState(false)
    const [selectedDuel, setSelectedDuel] = useState("")
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showWatchModal, setShowWatchModal] = useState(false)
    const [duelToBeWatched ,setDuelToBeWatched] = useState()
    const [showEditModal, setShowEditModal] = useState()
    const [redirectToHome, setRedirectToHome] = useState(false)

    useEffect(()=> {

        if (props && props.fetchStatus === 'failed') {
            setRedirectToHome(true)
        } else {
            if (props.playerMap && props.duels) {
                setDuels(props.duels);
                setPlayerMap(props.playerMap);
                setPlayersData(Array.from(props.playerMap.values()))
            }
        }

    },[props])

    function getPfp(player) {
        if (!player.hasPfp || !process.env.REACT_APP_BLOB_STORAGE_URL) {
            return defaultpfp;
        } else {
            // case has pfp
            // return process.env.REACT_APP_BLOB_STORAGE_URL + player.username + "?m=" + Date.now().toString();
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

    function handleClickScoreboard(duel) {
        setSelectedDuel(duel)
        setShowScoreboard(true)
    }

    function handleClickDelete(duel) {
        setSelectedDuel(duel)
        setShowDeleteModal(true)
    }

    function handleClickWatch(duel) {
        setShowWatchModal(true)
        setDuelToBeWatched(duel)
    }
    
    function handleClickEdit(duel) {
        setShowEditModal(true)
        setDuelToBeWatched(duel)
    }

    if (redirectToHome) {
        return <Navigate to={'/'}/>

    } else return (

        <div className="duels-dashboard-container">
            <div className="duels-header-container">
            <h2 style={{color: "white", fontWeight: "1000", fontSize: "40px", paddingTop: "25px",paddingBottom: "25px", letterSpacing: "2px"}}>Duels</h2>
            {props.isLoggedIn?"":<h6 style={{color: "white", paddingBottom: "20px"}}>Tip: In order to modify duels, You must be logged in.</h6>}
            </div>


            {props.isLoggedIn?<>
            <Button onClick={()=>{setShowModal(true)}} variant="dark" style={{marginTop: "35px", width: "250px"}}>
                START A DUEL
                <SportsKabaddiIcon style={{marginLeft: "15px"}}/>
            </Button>
            <DuelsModal 
                players={players} 
                show={showModal} 
                setShow={setShowModal} 
                fetchData={props.fetchData}
            />
            <DuelsScoreboard 
                duel={selectedDuel}
                show={showScoreboard} 
                setShow={setShowScoreboard} 
                playerMap={playerMap} 
                fetchData={props.fetchData}
             />
            <DeleteDuelModal 
                duel={selectedDuel}
                playerMap={playerMap}
                show={showDeleteModal}
                setShow={setShowDeleteModal}
                fetchData={props.fetchData}
            />
            <EditModal
                duel={duelToBeWatched}
                show={showEditModal}
                setShow={setShowEditModal}
                fetchData={props.fetchData}
            />
            </>:""}
            <WatchModal
                duel={duelToBeWatched}
                playerMap={playerMap}
                show={showWatchModal}
                setShow={setShowWatchModal}
            />

            <div className="recent-duels-container">
                <div className="matches-container">

                {duels ? duels.map((duel, i) => (
                        <div className={(duel.higherEloScore !== undefined && duel.lowerEloScore !== undefined)?
                        (duel.higherEloScore === 0 || duel.lowerEloScore === 0) ? "pickled-match-container" : "completed-match-container"
                        :
                        "in-progress-match-container"
                        } key={i}>
                            <div className="match-details-container">

                                <div className="match-details-header">
                                {duel.videoUrl?
                                <Button className="match-button" style={{width: "5rem", marginBottom: "0.75rem", marginLeft: "0.5rem"}} variant="dark" onClick={()=>{handleClickWatch(duel)}}>
                                    <VideocamIcon fontSize='medium'/>
                                </Button>
                                :""}
                                    <label className="date-label">{duel.date.substring(0,10)}</label>

                                    <label className="status-label">{(duel.higherEloScore !== undefined && duel.lowerEloScore !== undefined)?
                                    (duel.higherEloScore === 0 || duel.lowerEloScore === 0) ? "PICKLED" : "COMPLETED"
                                    :
                                    "IN PROGRESS"
                                    }</label>

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

                            <Divider className="vertical-divider" orientation="vertical" flexItem/>

                            <div className="button-container">

                                {(duel.higherEloScore !== undefined && duel.lowerEloScore !== undefined)
                                ?
                                <Button className="match-button" disabled={!props.isLoggedIn} variant="dark" onClick={()=>{handleClickEdit(duel)}}>
                                    <EditIcon fontSize='medium'/>
                                </Button>
                                :""}

                                {(!props.isLoggedIn || (duel.higherEloScore !== undefined && duel.lowerEloScore !== undefined))
                                ?
                                ""
                                :
                                <Button className="match-button" disabled={!props.isLoggedIn || (duel.higherEloScore !== undefined && duel.lowerEloScore !== undefined)} variant="dark" onClick={()=>{handleClickScoreboard(duel)}}>
                                    <ScoreboardIcon fontSize='medium'/>
                                </Button>
                                }
                                <div className="vertical-padding"></div>

                                <Button className="match-button" disabled={!props.isLoggedIn} variant="dark" onClick={()=>{handleClickDelete(duel)}}>
                                    <DeleteIcon fontSize='medium'/>
                                </Button>

                            </div>




                        </div>


                )):""}
                </div>

                    <div className="vertical-padding"></div>
                    <div className="vertical-padding"></div>
            </div>
    
            

            
        
        </div>

    )
}



