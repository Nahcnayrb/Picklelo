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

export default function DuelsDashboard(props) {

    const [showModal, setShowModal] = useState(false)
    const [players, setPlayersData] = useState([])
    const [duels, setDuels] = useState()
    const [playerMap, setPlayerMap] = useState()
    const [showScoreboard, setShowScoreboard] = useState(false)
    const [selectedDuel, setSelectedDuel] = useState("")
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [redirectToHome, setRedirectToHome] = useState(false)
    let fetchedDataSuccessfully = false

    useEffect(()=> {

        fetchData()

        setTimeout(()=> {
            if (!fetchedDataSuccessfully) {
                setRedirectToHome(true)
            }

        },1000)
    
    },[])

    async function fetchData() {

        await axios.get("/players").then(
            res => {
                fetchedDataSuccessfully = true
                setRedirectToHome(false)
                setPlayersData(res.data)
                let map = new Map();

                res.data.forEach((player) => {
                    map.set(player.username, player)
                })

                setPlayerMap(map)
        
        
            }
        ).catch(
            err => {

                console.log(err)
        
            }
        )

        await axios.get("/duels").then(
            res => {

                let duels = res.data
                duels.sort(function(a,b){
                    return new Date(b.date) - new Date(a.date)
                })
                setDuels(duels)
        
            }
        ).catch(
            err => {
                console.log(err)
            }
        )

    }

    function getPfp(player) {
        if (!player.hasPfp) {
            return defaultpfp;
        } else {
            // case has pfp
            return process.env.REACT_APP_BLOB_STORAGE_URL + player.username + "?m=" + Date.now().toString();
        }

    }

    function calculateEloChange(duel, username) {
        if (!duel.lowerEloScore || !duel.higherEloScore) {
            return ""
        } else {
            // we have scores for both players
            if (duel.lowerEloScore > duel.higherEloScore) {
                // lower elo player won
                if (username == duel.lowerEloUsername) {
                    return " (" + "+" + duel.lowerEloGainPotential + ")"
                } else {
                    // case other player
                    return " (" + "-" + duel.lowerEloGainPotential + ")"
                }
            } else {
                // high elo player won
                if (username == duel.higherEloUsername) {
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
                fetchData={fetchData}
            />
            <DuelsScoreboard 
                duel={selectedDuel}
                show={showScoreboard} 
                setShow={setShowScoreboard} 
                playerMap={playerMap} 
                fetchData={fetchData}
             />
            <DeleteDuelModal 
                duel={selectedDuel}
                playerMap={playerMap}
                show={showDeleteModal}
                setShow={setShowDeleteModal}
                fetchData={fetchData}
            />
            </>:""}

            <div className="recent-duels-container">
                <div className="matches-container">

                {duels ? duels.map((duel, i) => (
                        <div className={(duel.higherEloScore && duel.lowerEloScore)?"completed-match-container":"in-progress-match-container"} key={i}>
                            <div className="match-details-container">

                                <div className="match-details-header">
                                    <label className="date-label">{duel.date.substring(0,10)}</label>

                                    <label className="status-label">{(duel.higherEloScore && duel.lowerEloScore)?"COMPLETED":"IN PROGRESS"}</label>

                                </div>
                                <Divider className="horizontal-divider" orientation="horizontal"/>

                                <div className="team-container">
                                    {playerMap?<img src={getPfp(playerMap.get(duel.higherEloUsername))} className='match-pfp' style={{marginTop: "0.75rem"}}></img>:""}
                                    {playerMap?<label className="match-label">{playerMap.get(duel.higherEloUsername).name + calculateEloChange(duel, duel.higherEloUsername)}</label>:""}
                                    <Divider className="vertical-divider" orientation="vertical" flexItem/>
                                    <div className="score-container">
                                        <label className="score-label">{duel.higherEloScore}</label>
                                    </div>
                                </div>
                                <Divider className="horizontal-divider" orientation="horizontal"/>
                                <div className="team-container">
                                    {playerMap?<img src={getPfp(playerMap.get(duel.lowerEloUsername))} className='match-pfp' style={{marginTop: "0.75rem"}}></img>:""}
                                    {playerMap?<label className="match-label">{playerMap.get(duel.lowerEloUsername).name + calculateEloChange(duel, duel.lowerEloUsername)}</label>:""}
                                    <Divider className="vertical-divider" orientation="vertical" flexItem/>
                                    <div className="score-container">
                                        <label className="score-label">{duel.lowerEloScore}</label>
                                    </div>
                                </div>


                            </div>

                            <Divider className="vertical-divider" orientation="vertical" flexItem/>

                            <div className="button-container">

                                <Button className="match-button" disabled={!props.isLoggedIn || (duel.higherEloScore && duel.lowerEloScore)} variant="dark" onClick={()=>{handleClickScoreboard(duel)}}>
                                    <ScoreboardIcon fontSize='medium'/>
                                </Button>
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



