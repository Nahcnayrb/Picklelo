
import { useState, useEffect} from 'react';
import axios from 'axios';
import pfp from "./0140.png"
import devon from "./0542.png"
import bryan from "./1027.png"
import ivan from "./0546.png"
import saku from "./0427.png"
import adarn from "./0433.png"
import wilson from "./0438.png"
import kai from "./0137.png"
import defaultpfp from "./0617.png"
import { Navigate } from "react-router-dom";

import { Divider } from '@mui/material';
export default function Leaderboard() {

    const [players, setPlayers] = useState()
    const [topThreePlayers, setTopThreePlayers] = useState()
    const [clickedPlayerUsername, setClickedPlayerUsername] = useState("")
    const [redirectToHome, setRedirectToHome] = useState(false)
    let fetchedDataSuccessfully = false;

    function fetchAllUsers() {
        
        axios.get("/players").then(
            res => {
                fetchedDataSuccessfully = true
                setRedirectToHome(false)
                let players = res.data

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
        ).catch (
            err => {

                console.log(err.response)

            }
        )

    }

    function handlePlayerClick(playerUsername) {
        setClickedPlayerUsername(playerUsername)

    }

    function getCorrespondingPfp(playerUsername) {
        if (playerUsername == "sakura") {
            return saku
        } else if (playerUsername == "izeng") {
            return ivan
        } else if (playerUsername == "devonwu") {
            return devon
        } else if (playerUsername == "adarn") {
            return adarn
        } else if (playerUsername == "bryanly") {
            return bryan
        } else if (playerUsername == "goon") {
            return wilson
        } else if (playerUsername == "bryanchan") {
            return kai
        } else if (playerUsername == "nahcnayrb") {
            return pfp
        } else {
            return defaultpfp
        }
    }


    useEffect(()=> {

        fetchAllUsers()
        // sort player list based on elo descending
        // for each player in player list
        // make a list item of name, elo
        setTimeout(()=> {
            if (!fetchedDataSuccessfully) {
                setRedirectToHome(true)
            }

        }, 1000)

      },[])

    if (redirectToHome) {
        return <Navigate to={'/'}/>
    } else if (clickedPlayerUsername) {
        return <Navigate to={'/players/' + clickedPlayerUsername}/> 
    } else return (
    <div className='leaderboard-container'>
        <h2 style={{color: "white", fontWeight: "1000", fontSize: "30px", paddingTop: "50px",paddingBottom: "5px", letterSpacing: "1px"}}>Season 1 Leaderboard</h2>
        <label style={{color: "white", fontWeight: "700", fontSize: "14px"}}>Tip: Tap on a player to view their profile!</label>

        {topThreePlayers?
            <div className='top-three-container' style={{marginTop: "10px"}}>

                <div className='second-place-container' onClick={() => {handlePlayerClick(topThreePlayers[1].username)}}>
                    <div className='photo-container'>
                        <img src={getCorrespondingPfp(topThreePlayers[1].username)} className='pfp' style={{marginTop: "0.75rem"}}></img>

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
                        <img src={getCorrespondingPfp(topThreePlayers[0].username)} className='pfp' style={{marginTop: "0.75rem"}}></img>

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
                    <img src={getCorrespondingPfp(topThreePlayers[2].username)} className='pfp' style={{marginTop: "0.75rem"}}></img>

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

                            
                            <img src={getCorrespondingPfp(player.username)} className='rest-pfp' style={{marginTop: "0.75rem"}}></img>

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