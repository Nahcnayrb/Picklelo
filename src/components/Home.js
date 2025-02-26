import { CircularProgress } from '@mui/material';
import pickleball from "./pickleball-logo.png"
import { useState, useEffect} from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

export default function Home() {

    const [selectedPlayer, setSelectedPlayer] = useState()
    const [loadedPlayers, setLoadedPlayers] = useState()
    const [data, setData] = useState([])


    const [numTries, setNumTries] = useState(0);
    function handleSelect(item) {
        // console.log(record.item.id)
        // setSelectedPlayer(record.item.id)
        console.log(item.id)
        setSelectedPlayer(item.id)

    }

    function getPlayers() {

    }



    useEffect(()=> {

        // periodically fetches player data until it succeeds

        axios.get("/players").then(
            res => {
                setLoadedPlayers(true)
                let players = res.data
        
                let searchBarData = []
        
                players.forEach((player) => {
                    let playerData = {
                        id: player.username,
                        name: player.name + " (" + player.username + ")"
                    }
                    searchBarData.push(playerData)
                    setData(searchBarData)
            
                })

                if (numTries > 0) {
                    // reload so that the authentication process retries
                    window.location.reload();
                }

            }

        ).catch(
        
            err => {

                setTimeout(()=>{
                    setNumTries(numTries + 1);
                },5000);
                console.log(err.response)
    
            }
        )
    
      },[numTries])
    
    

    
    if (selectedPlayer) {
        return <Navigate to={'/players/' + selectedPlayer}/>
    } else {

        return (
            <div className="searchbox-container">
                <img className="pickleball-img" src={pickleball}/>
                {loadedPlayers
                ?
                <div className='searchbox'>
                    <ReactSearchAutocomplete 
                    items={data} 
                    onSelect={handleSelect}
                    fuseOptions={{
                        keys: ['name'],
                        threshold: 0.3
                        // 0.2 = no typos
                        // 0.3 allows some typos
                    }}
                    placeholder='Search for a player...'/>
                </div>
                :
                <div>
                    
                    <h4>Server is waking up...</h4>
                    <h4> Picklelo should be ready in ~1 min.</h4>
                    <h6 style={{paddingBottom: "3rem"}}>This page will automatically refresh once the server is ready.</h6>
                    <CircularProgress color='inherit' />
                    
                </div>
                
            
                }
            </div> 

        
        )
    }
}