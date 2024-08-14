import AccountBoxIcon from '@mui/icons-material/AccountBox';
import pickleball from "./pickleball-logo.png"
import { useState, useEffect} from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

export default function Home() {

    const [selectedPlayer, setSelectedPlayer] = useState()
    const [data, setData] = useState([])

    function handleSelect(item) {
        // console.log(record.item.id)
        // setSelectedPlayer(record.item.id)
        console.log(item.id)
        setSelectedPlayer(item.id)

    }


    useEffect(()=> {

        axios.get("/players").then(
            res => {
    
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
        
            }
        ).catch(
            err => {
    
                console.log(err.response)
      
            }
        )
    
      },[])
    
    

    
    if (selectedPlayer) {
        return <Navigate to={'/players/' + selectedPlayer}/>
    } else {

        return (
            // <div className='auth-wrapper'>
                <div className="searchbox-container">
                    <img className="pickleball-img" src={pickleball}/>
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
                </div>
            // </div>
        
        )
    }
}