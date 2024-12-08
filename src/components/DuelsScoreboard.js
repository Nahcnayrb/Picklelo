import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import Select from 'react-select'
import axios from 'axios';

export default function DuelsScoreboard(props) {

    const [lowerEloName, setLowerEloName] = useState()
    const [higherEloName, setHigherEloName] = useState()
    const [lowerEloScore, setLowerEloScore] = useState("")
    const [higherEloScore, setHigherEloScore] = useState("")

    useEffect(()=> {
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

        let lowerEloUsername = props.duel.lowerEloUsername
        let higherEloUsername = props.duel.higherEloUsername
        
        let originalLowerElo = props.playerMap.get(lowerEloUsername).elo
        let originalHigherElo = props.playerMap.get(higherEloUsername).elo

        let newLowerElo = originalLowerElo + lowerEloPlayerChange
        let newHigherElo = originalHigherElo + higherEloPlayerChange

        let lowerEloData = {
            elo: Math.floor(newLowerElo)
        }

        let higherEloData = {
            elo: Math.floor(newHigherElo)
        }

        await axios.put("/players/" + lowerEloUsername, lowerEloData)
        await axios.put("/players/" + higherEloUsername, higherEloData)
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
                
                <h3>{lowerEloName?higherEloName + " vs. " + lowerEloName:""}</h3>
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                    <label  className='modal-label'>{higherEloName + "'s Score:"}</label>
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


                    <div className='modal-padding'></div>

                    <label  className='modal-label'>{lowerEloName + "'s Score:"} </label>
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