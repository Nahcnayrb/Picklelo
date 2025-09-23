
import Button from 'react-bootstrap/Button';

import HighlightsModal from './HighlightsModal';
import { useState, useEffect } from "react";

import "./DuelsDashboard.css"

import defaultpfp from "./0617.png"
import { Navigate } from "react-router-dom";
import StarIcon from '@mui/icons-material/Star';
import DeleteHighlightModal from './DeleteHighlightModal';
import Highlights from './Highlights';

export default function HighlightsDashboard(props) {

    const [showModal, setShowModal] = useState(false)
    const [players, setPlayersData] = useState([])

    const [playerMap, setPlayerMap] = useState()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [redirectToHome, setRedirectToHome] = useState(false)

    const [highlights, setHighlights] = useState([])
    const [selectedHighlight, setSelectedHighlight] = useState()
    const [clickedPfpUsername, setClickedPfpUsername] = useState("")


    useEffect(()=> {

        if (props && props.fetchStatus === 'failed') {
            setRedirectToHome(true)
        } else {
            if (props && props.playerMap && props.highlights) {
                setPlayerMap(props.playerMap);
                setHighlights(props.highlights);
                setPlayersData(Array.from(props.playerMap.values()));

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

    if (redirectToHome) {
        return <Navigate to={'/'}/>

    } else if (clickedPfpUsername.length > 0) {
        return <Navigate to={'/players/' + clickedPfpUsername}/>

    } else return (

        <div className="duels-dashboard-container">
            <div className="duels-header-container">
            <h2 style={{color: "white", fontWeight: "1000", fontSize: "40px", paddingTop: "25px",paddingBottom: "25px", letterSpacing: "2px"}}>Highlights</h2>
            {props.isLoggedIn?"":<h6 style={{color: "white", paddingBottom: "20px"}}>Tip: In order to modify highlights, You must be logged in.</h6>}
            </div>


            {props.isLoggedIn?<>
            <Button onClick={()=>{setShowModal(true)}} variant="dark" style={{marginTop: "35px", width: "250px"}}>
                Create Highlight
                <StarIcon style={{marginLeft: "15px"}}/>
            </Button>
            <HighlightsModal
                players={players} 
                show={showModal} 
                setShow={setShowModal} 
                fetchData={props.fetchData}
                user={props.user}
            />
            <DeleteHighlightModal
                highlight={selectedHighlight}
                playerMap={playerMap}
                show={showDeleteModal}
                setShow={setShowDeleteModal}
                fetchData={props.fetchData}

            />
            </>
            :""
            }

            {!highlights || !playerMap ? "" :
                <div className='highlights-dashboard-container'>
                    <div className='highlights-container' style={{width: "80%", height: "60%"}}>
                        <Highlights
                            highlights={highlights}
                            playerMap={playerMap}
                            setSelectedHighlight={setSelectedHighlight}
                            setShowDeleteModal={setShowDeleteModal}
                            setClickedPfpUsername={setClickedPfpUsername}
                            getPfp={getPfp}
                            isHighlightsDashboard={true}
                            isLoggedIn={props.isLoggedIn}
                        />
                    </div>
                </div>
            }
           
        </div>

    )
}