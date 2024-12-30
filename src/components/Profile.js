import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import defaultpfp from "./0617.png"
import { Divider } from "@mui/material";
import "./Profile.css"

export default function Profile(props) {
    const { username } = useParams()
    const [playerMap, setPlayerMap] = useState()
    const [duels, setDuels] = useState([])

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

    function userIsWinner(duel, username) {

        const userIsHigherElo = (username === duel.higherEloUsername)
        if (userIsHigherElo) {
            return (duel.higherEloScore > duel.lowerEloScore);
        } else {
            // case user is lower elo
            return (duel.lowerEloScore > duel.higherEloScore);
        }

    }

    function getContainer(duel, username) {
        // if match is still in progress, use in-progress container

        // if user is winner, use victory container

        // else use defeat container
        if (!duel.higherEloScore || !duel.lowerEloScore) {
            return "in-progress-match-container";
        } else {
            // case match completed
            // determine winner
            return userIsWinner(duel, username) ? "victory-match-container" : "defeat-match-container";
        }

    }

    useEffect(()=> {

        fetchData();
        fetchDuels();

    },[])

    return (
        <div className="duels-dashboard-container">
            <div className="profile-header-container">
                <h1 style={{textAlign: "center", color: "white"}}>{username}</h1>
            </div>
            <div className="match-history-container">
                <div className="matches-container">
                    {duels ? duels.map((duel, i) => (
                        <div className={getContainer(duel, username)} key={i}>
                        <div className="new-match-details-container">

                            <div className="match-details-header">
                                <label className="date-label">{duel.date.substring(0,10)}</label>

                                <label className="status-label">{(duel.higherEloScore && duel.lowerEloScore)?
                                userIsWinner(duel, username) ? "VICTORY" : "DEFEAT"
                                :
                                "IN PROGRESS"}</label>

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
                    </div>

                    )):""
                    }
                    <div style={{marginTop: "4rem"}}></div>

                </div>
            </div>
        </div>
    
        
    )

}