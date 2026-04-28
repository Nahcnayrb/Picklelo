import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';

export default function DuelsScoreboard(props) {


    const [player1Name, setPlayer1Name] = useState("")
    const [player2Name, setPlayer2Name] = useState("")
    const [player3Name, setPlayer3Name] = useState("")
    const [player4Name, setPlayer4Name] = useState("")

    const [lowerEloScore, setLowerEloScore] = useState("")
    const [higherEloScore, setHigherEloScore] = useState("")
    const [isDoublesMatch, setIsDoublesMatch] = useState(false);

    useEffect(()=> {
        if (!props.playerMap || props.playerMap.length == 0 || !props.duel ) {
            return
        } else {
            // case props ready
            let lowerEloUsername = props.duel.lowerEloUsername
            let higherEloUsername = props.duel.higherEloUsername

            const isDoubles = props.duel.isDoublesMatch;

            setIsDoublesMatch(isDoubles);

            if (isDoubles) {
                // case 4 players
                setPlayer1Name(props.playerMap.get(lowerEloUsername[0]).name);
                setPlayer2Name(props.playerMap.get(lowerEloUsername[1]).name);
                setPlayer3Name(props.playerMap.get(higherEloUsername[0]).name);
                setPlayer4Name(props.playerMap.get(higherEloUsername[1]).name);
            } else {
                setPlayer1Name(props.playerMap.get(lowerEloUsername[0]).name);
                setPlayer2Name(props.playerMap.get(higherEloUsername[0]).name);
            }
        }

    },[props])

    function handleClose() {
        setLowerEloScore("")
        setHigherEloScore("")
        props.setShow(false)
    }

    async function handleConfirm() {


        let lowerEloPlayerChange = 0
        let higherEloPlayerChange = 0

        // determine who the winner is
        // apply elo change to both players
        if (Number(lowerEloScore) > Number(higherEloScore)) {
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

        // update duel

        let duelData = {
            lowerEloScore: Number(lowerEloScore),
            higherEloScore: Number(higherEloScore)
        }

        await axios.put("/duels/" + props.duel._id, duelData)

        // update players elos

        const isDoublesMatch = props.duel.isDoublesMatch;
        if (isDoublesMatch) {

            let lowerEloUsername = props.duel.lowerEloUsername
            let higherEloUsername = props.duel.higherEloUsername

            const player1Elo = { elo: Math.floor(props.playerMap.get(lowerEloUsername[0]).elo + lowerEloPlayerChange) };
            const player2Elo = { elo: Math.floor(props.playerMap.get(lowerEloUsername[1]).elo + lowerEloPlayerChange) };

            const player3Elo = { elo: Math.floor(props.playerMap.get(higherEloUsername[0]).elo + higherEloPlayerChange) };
            const player4Elo = { elo: Math.floor(props.playerMap.get(higherEloUsername[1]).elo + higherEloPlayerChange) };

            await axios.put("/players/" + lowerEloUsername[0], player1Elo);
            await axios.put("/players/" + lowerEloUsername[1], player2Elo);
            await axios.put("/players/" + higherEloUsername[0], player3Elo);
            await axios.put("/players/" + higherEloUsername[1], player4Elo);

        } else {

            let lowerEloUsername = props.duel.lowerEloUsername
            let higherEloUsername = props.duel.higherEloUsername
            
            let originalLowerElo = props.playerMap.get(lowerEloUsername[0]).elo
            let originalHigherElo = props.playerMap.get(higherEloUsername[0]).elo

            let newLowerElo = originalLowerElo + lowerEloPlayerChange
            let newHigherElo = originalHigherElo + higherEloPlayerChange

            let lowerEloData = {
                elo: Math.floor(newLowerElo)
            }

            let higherEloData = {
                elo: Math.floor(newHigherElo)
            }

            // if game mode is doubles, we need to apply elo changes to all 4 players
            await axios.put("/players/" + lowerEloUsername[0], lowerEloData)
            await axios.put("/players/" + higherEloUsername[0], higherEloData)
        }

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
                <h3> {player1Name ? player1Name + " + " + player2Name + " vs. " + player3Name + " + " + player4Name : ""} </h3> 
                :
                 <h3> {player1Name? player1Name + " vs. " + player2Name : ""} </h3>
                }
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                    {isDoublesMatch ? 
                    <label  className='modal-label'>{"Team 1 (" + player1Name + " + " + player2Name + ")'s Score:"}</label>
                    :
                    <label  className='modal-label'>{ player1Name + "'s Score:"}</label>
                    }

                    <input type='tel' 
                    pattern="[0-9]*"
                    onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    className="form-control" 
                    style={{width: "100px"}}
                    placeholder="" value={lowerEloScore} onChange={(e) => setLowerEloScore(e.target.value)}/>


                    <div className='modal-padding'></div>

                    {isDoublesMatch ? 
                    <label  className='modal-label'>{"Team 2 (" + player3Name + " + " + player4Name + ")'s Score:"}</label>
                    :
                    <label  className='modal-label'>{player2Name + "'s Score:"} </label>
                    }
                    <input type='tel' 
                    pattern="[0-9]*"
                    onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    className="form-control" 
                    style={{width: "100px"}}
                    placeholder="" value={higherEloScore} onChange={(e) => setHigherEloScore(e.target.value)}/>

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