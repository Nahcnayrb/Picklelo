
import { useState, useEffect} from 'react';
import axios from 'axios';
import defaultpfp from "../assets/defaultpfp.png";
import { Navigate } from "react-router-dom";

import { Divider } from '@mui/material';
export default function Leaderboard(props) {

    const [players, setPlayers] = useState()
    const [topThreePlayers, setTopThreePlayers] = useState()
    const [clickedPlayerUsername, setClickedPlayerUsername] = useState("")
    const [redirectToHome, setRedirectToHome] = useState(false)

    function processUsers() {

        if (!props.playerMap) {
            return;
        }
        let players = Array.from(props.playerMap.values());

        
        players.sort(function(a,b) {
            return b.elo - a.elo
        })

        let topThree = []
        topThree.push(players.shift())
        topThree.push(players.shift())
        topThree.push(players.shift())

        setTopThreePlayers(topThree)


        setPlayers(players)


    }

    function handlePlayerClick(playerUsername) {
        setClickedPlayerUsername(playerUsername)

    }

    function getPfp(player) {
        if (!player.hasPfp || !process.env.REACT_APP_BLOB_STORAGE_URL) {
            return defaultpfp;
        } else {
            // case has pfp
            // return process.env.REACT_APP_BLOB_STORAGE_URL + player.username;
            
            return props.pfpMap.get(player.username);
        }

    }


    useEffect(()=> {

        if (props && props.fetchStatus === 'failed') {
            setRedirectToHome(true)
        } else {
            processUsers()
        }

      },[props]
    );

    if (redirectToHome) {
        return <Navigate to={'/'}/>
    } else if (clickedPlayerUsername) {
        return <Navigate to={'/players/' + clickedPlayerUsername}/> 
    } else return (
    <div className='leaderboard-container'>
        <h2 style={{color: "white", fontWeight: "1000", fontSize: "35px", paddingTop: "50px",paddingBottom: "5px", letterSpacing: "1px"}}>Leaderboard</h2>
        <label style={{color: "white", fontWeight: "700", fontSize: "14px"}}>Tip: Tap on a player to view their profile!</label>

        {topThreePlayers?
            <div className='top-three-container' style={{marginTop: "10px"}}>

                <div className='second-place-container' onClick={() => {handlePlayerClick(topThreePlayers[1].username)}}>
                    <div className='photo-container'>
                        <img src={getPfp(topThreePlayers[1])} className='pfp' style={{marginTop: "0.75rem"}}></img>

                    </div>
                    <div className='name-container'>
                        <label style={{color: "white", fontWeight: "700", fontSize: "20px"}}>{topThreePlayers[1].name}</label>

                    </div>

                    <div className='elo-container'>
                        <label className="elo-label" style={{backgroundColor: "#C0C0C0"}}>{topThreePlayers[1].elo}</label>

                    </div>
                    <div className='ranking-container'>
                        <label className='ranking-label' style={{fontSize: "3rem", marginTop: "1.25rem"}}>2</label>

                    </div>
                    

                </div>

                <div className='first-place-container' onClick={() => {handlePlayerClick(topThreePlayers[0].username)}}>

                <div className='photo-container'>
                        <img src={getPfp(topThreePlayers[0])} className='pfp' style={{marginTop: "0.75rem"}}></img>
                    </div>
                    <div className='name-container'>
                        <label style={{color: "white", fontWeight: "700", fontSize: "23px"}}>{topThreePlayers[0].name}</label>

                    </div>

                    <div className='elo-container'>
                        <label className="elo-label" style={{backgroundColor: "gold"}}>{topThreePlayers[0].elo}</label>

                    </div>
                    <div className='ranking-container'>
                        <label className='ranking-label' style={{fontSize: "4rem", marginRight: "5px"}}>1</label>

                    </div>


                </div>
                <div className='third-place-container' onClick={() => {handlePlayerClick(topThreePlayers[2].username)}}>

                <div className='photo-container'>
                    <img src={getPfp(topThreePlayers[2])} className='pfp' style={{marginTop: "0.75rem"}}></img>

                    </div>
                    <div className='name-container'>
                        <label style={{color: "white", fontWeight: "700", fontSize: "20px"}}>{topThreePlayers[2].name}</label>

                    </div>

                    <div className='elo-container'>
                        <label className="elo-label" style={{backgroundColor: "#CD7F32"}}>{topThreePlayers[2].elo}</label>

                    </div>
                    <div className='ranking-container'>
                        <label className='ranking-label' style={{fontSize: "3rem"}}>3</label>

                    </div>


                </div>
                
            </div>
            :""}

        <div className='rest-leaderboard-container' >
            {players?players.map((player, i) => (

                <div key={i}>
                    <div className='rest-player-container' onClick={() => {handlePlayerClick(player.username)}}>


                            <div className='rest-ranking-container'>
                                        <label className='ranking-label' style={{fontSize: "30px"}}>{i+4}</label>

                            </div>

                            
                            <img src={getPfp(player)} className='rest-pfp' style={{marginTop: "0.75rem"}}></img>

                            <div className='rest-name-container'>
                                <label className='rest-name-label'>{player.name}</label>
                            </div>

                            <Divider orientation="vertical" variant="middle" flexItem />

                            <div className='rest-elo-container'>
                                <label className='rest-elo-label'>{player.elo}</label>
                            </div>

                        </div>
                    <Divider variant="middle" />
                </div>


            )):""}
        </div>
            

    </div>
    )

}