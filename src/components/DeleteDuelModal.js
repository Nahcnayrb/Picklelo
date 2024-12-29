import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';

export default function DeleteDuelModal(props) {

    const [lowerEloName, setLowerEloName] = useState("")
    const [higherEloName, setHigherEloName] = useState("")

    useEffect(()=>{

        if (!props.playerMap || props.playerMap.length == 0 || !props.duel ) {
            return
        } else {
            // case props ready
            let lowerEloUsername = props.duel.lowerEloUsername
            let higherEloUsername = props.duel.higherEloUsername


            setLowerEloName(props.playerMap.get(lowerEloUsername).name)
            setHigherEloName(props.playerMap.get(higherEloUsername).name)
        }

    },[props])

    function handleClose() {
        props.setShow(false)
    }

    async function handleConfirm() {

        // if lowerEloScore & higherEloScore exists, this means duel is completed
        // need to revert changes
        // else just need to delete duel

        let matchIsCompleted = (props.duel.lowerEloScore && props.duel.higherEloScore)

        if (matchIsCompleted) {
            // need to revert changes
           revertEloChanges()
        }

        // delete duel

        await axios.delete("/duels/" + props.duel._id)
        console.log("deleted duel")

        await props.fetchData()
        
        handleClose()

    }

    async function revertEloChanges() {
        // if we're in this function, the current duel is for sure completed

        let lowerEloPlayerChange = 0
        let higherEloPlayerChange = 0

        // determine who the winner is
        // apply elo change to both players
        if (Number(props.duel.lowerEloScore) > Number(props.duel.higherEloScore)) {
            // lower elo player wins
            // lower elo gains lowerEloPotentialGain
            // higher elo loses lowerEloPotentialGain
            lowerEloPlayerChange = Number(props.duel.lowerEloGainPotential)
            higherEloPlayerChange = (-1) * lowerEloPlayerChange

        } else {
            // higher elo player wins
            // lower elo loses higherEloPotentialGain
            // higher elo gains higherEloPotentialGain
            higherEloPlayerChange = Number(props.duel.higherEloGainPotential)
            lowerEloPlayerChange = (-1) * higherEloPlayerChange


        }

        let higherEloReversion = (-1) * higherEloPlayerChange
        let lowerEloReversion = (-1) * lowerEloPlayerChange


        let lowerEloUsername = props.duel.lowerEloUsername
        let higherEloUsername = props.duel.higherEloUsername
        
        let originalLowerElo = props.playerMap.get(lowerEloUsername).elo
        let originalHigherElo = props.playerMap.get(higherEloUsername).elo

        let newLowerElo = originalLowerElo + lowerEloReversion
        let newHigherElo = originalHigherElo + higherEloReversion

        let lowerEloData = {
            elo: Math.floor(newLowerElo)
        }

        let higherEloData = {
            elo: Math.floor(newHigherElo)
        }

        await axios.put("/players/" + lowerEloUsername, lowerEloData)
        await axios.put("/players/" + higherEloUsername, higherEloData)
        console.log("updated players elo")
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
                
                <h3>{lowerEloName?higherEloName + " vs. " + lowerEloName:""}</h3>
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>

            {lowerEloName?<label style={{ fontSize: "20px"}}>Are you sure you want to delete the duel between {lowerEloName} and {higherEloName}?
                 </label>:""}


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