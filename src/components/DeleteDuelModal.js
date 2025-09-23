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

        let promises = [];
        if (isDoublesMatch) {

            const player1Elo = { elo: Math.floor(props.playerMap.get(lowerEloUsername[0]).elo + lowerEloReversion) };
            const player2Elo = { elo: Math.floor(props.playerMap.get(lowerEloUsername[1]).elo + lowerEloReversion) };

            const player3Elo = { elo: Math.floor(props.playerMap.get(higherEloUsername[0]).elo + higherEloReversion) };
            const player4Elo = { elo: Math.floor(props.playerMap.get(higherEloUsername[1]).elo + higherEloReversion) };


            promises.push(axios.put("/players/" + lowerEloUsername[0], player1Elo));
            promises.push(axios.put("/players/" + lowerEloUsername[1], player2Elo));
            promises.push(axios.put("/players/" + higherEloUsername[0], player3Elo));
            promises.push(axios.put("/players/" + higherEloUsername[1], player4Elo));

        } else {
            
            let originalLowerElo = props.playerMap.get(lowerEloUsername[0]).elo
            let originalHigherElo = props.playerMap.get(higherEloUsername[0]).elo

            let newLowerElo = originalLowerElo + lowerEloReversion
            let newHigherElo = originalHigherElo + higherEloReversion

            let lowerEloData = {
                elo: Math.floor(newLowerElo)
            }

            let higherEloData = {
                elo: Math.floor(newHigherElo)
            }

            // if game mode is doubles, we need to apply elo changes to all 4 players
            promises.push(axios.put("/players/" + lowerEloUsername[0], lowerEloData));
            promises.push(axios.put("/players/" + higherEloUsername[0], higherEloData));
        }

        await Promise.all(promises);
    
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