import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';

export default function DeleteDuelModal(props) {

    const [player1Name, setPlayer1Name] = useState("");
    const [player2Name, setPlayer2Name] = useState("");
    const [player3Name, setPlayer3Name] = useState("");
    const [player4Name, setPlayer4Name] = useState("");
    const [isDoublesMatch, setIsDoublesMatch] = useState(false);

    useEffect(()=>{

        if (!props.playerMap || props.playerMap.length == 0 || !props.duel ) {
            return
        } else {
            // case props ready
            let lowerEloUsername = props.duel.lowerEloUsername
            let higherEloUsername = props.duel.higherEloUsername

            const isDoubles = props.duel.isDoublesMatch;
            setIsDoublesMatch(isDoubles);

            if (isDoubles) {
                setPlayer1Name(props.playerMap.get(lowerEloUsername[0]).name)
                setPlayer2Name(props.playerMap.get(lowerEloUsername[1]).name)
                setPlayer3Name((props.playerMap.get(higherEloUsername[0]).name))
                setPlayer4Name((props.playerMap.get(higherEloUsername[1]).name))
            } else {
                setPlayer1Name(props.playerMap.get(lowerEloUsername[0]).name)
                setPlayer2Name((props.playerMap.get(higherEloUsername[0]).name))
            }
        }

    },[props])

    function handleClose() {
        props.setShow(false)
    }

    async function handleConfirm() {

        // delete duel

        await axios.delete("/duels/" + props.duel._id)

        await props.fetchData()
        
        handleClose()

    }

    return (
        <Modal
        className='duels-modal'
        show={props.show}
        onHide={handleClose}
        keyboard={false}
        size='xl'
        backdrop='static'>

            <Modal.Header className='modal-header'closeButton>
            <Modal.Title >
            {isDoublesMatch ? 
            <h3>{player1Name? player1Name + " & " + player2Name + " vs. " + player3Name + " & " + player4Name:""}</h3>
            :
            <h3>{player1Name?player1Name + " vs. " + player2Name:""}</h3>}
            
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>

            {isDoublesMatch ? 
            player1Name?<label style={{ fontSize: "20px"}}>Are you sure you want to delete the duel between {player1Name} & {player2Name} vs. {player3Name} & {player4Name}?
            </label>:""
            :
            
            player1Name?<label style={{ fontSize: "20px"}}>Are you sure you want to delete the duel between {player1Name} and {player2Name}?
            </label>:""
            }

            <label style={{marginTop: "20px", fontSize: "20px", fontWeight: "600"}}>If the duel is completed, any ELO changes resulted from the duel will be REVERTED.</label>

            </Modal.Body>

            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            <Button variant="primary" onClick={() => {handleConfirm()}}>Confirm</Button>
            </Modal.Footer>
    </Modal>
    )
}