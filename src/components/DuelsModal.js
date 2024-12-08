import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import Select from 'react-select'
import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.css';
export default function DuelsModal(props) {

    const [firstSelectOptions, setFirstSelectOptions] = useState([])
    const [secondSelectOptions, setSecondSelectOptions] = useState([])
    const [firstSelectedOpponent, setFirstSelectedOpponent] = useState()
    const [secondSelectedOpponent, setSecondSelectedOpponent] = useState()
    const [showPotentialEloChanges, setShowPotentialEloChanges] = useState(false)
    const [secondOpponentPotentialGain, setSecondOpponentPotentialGain] = useState()
    const [firstOpponentPotentialGain, setFirstOpponentPotentialGain] = useState()

    function handleClose() {
        setFirstOpponentPotentialGain("")
        setSecondOpponentPotentialGain("")
        setShowPotentialEloChanges(false)
        setFirstSelectedOpponent("")
        setSecondSelectedOpponent("")
        props.setShow(false)
    }


    useEffect(()=> {

        
        let selections = []
                    
        props.players.forEach((player) => {
            
            let option = {
                value: player,
                label: player.name + " (" + player.elo + ")"
            }
            selections.push(option)
            
        })

        selections.sort(function(a,b) {
            return b.value.elo - a.value.elo
        })
    
        setFirstSelectOptions(selections)
        setSecondSelectOptions(selections)
    
    },[props.players])

    function getOptionsList(filteredUsername) {

        let selections = []
                    
        props.players.forEach((player) => {

            if (player.username != filteredUsername) {
            
                let option = {
                    value: player,
                    label: player.name + " (" + player.elo + ")"
                }
                selections.push(option)
            }
            
        })

        selections.sort(function(a,b) {
            return b.value.elo - a.value.elo
        })
    
        return selections


    }

    function calculateLossPotential(eloDifference) {
        let maxLoss = 30
        let minLoss = 15
        // need to round down as integer
        let calculatedLoss = ((1500)/(eloDifference)) 
        return Math.floor(Math.max(minLoss,Math.min(maxLoss, calculatedLoss)))
    }

    function calaculateGainPotential(eloDifference) {
        let maxGain = 150
        let minGain = 30
        let calculatedGain = Math.min(150, Math.max(minGain,0.2*(eloDifference))) 
        return Math.floor(calculatedGain)

    }


    function calculatePotentialEloChanges(user, opponent) {
        // user's potential gain == opp's potential loss
        // user's potential loss == opp's potential gain

        let eloDiff = Math.abs(user.elo - opponent.elo)
        let lowerEloPlayerPotentialLoss = calculateLossPotential(eloDiff)
        let lowerEloPlayerPotentialGain = calaculateGainPotential(eloDiff)

        if (user.elo < opponent.elo) {
            // user is the lower elo player
            setSecondOpponentPotentialGain(lowerEloPlayerPotentialLoss)
            setFirstOpponentPotentialGain(lowerEloPlayerPotentialGain)
        } else {
            // user is the higher elo player
            setFirstOpponentPotentialGain(lowerEloPlayerPotentialLoss)
            setSecondOpponentPotentialGain(lowerEloPlayerPotentialGain)
        }

    }

    function handleCreate() {
        let lowerEloOpponentUsername = ""
        let higherEloOpponentUsername = ""
        let lowerEloPotentialGain = 0
        let higherEloPotentialGain = 0

        if (firstSelectedOpponent.value.elo < secondSelectedOpponent.value.elo) {
            // first opponent is lower elo
            lowerEloOpponentUsername = firstSelectedOpponent.value.username
            lowerEloPotentialGain = firstOpponentPotentialGain
            higherEloOpponentUsername = secondSelectedOpponent.value.username
            higherEloPotentialGain = secondOpponentPotentialGain
        
        } else {
            // second opponent is lower elo
            lowerEloOpponentUsername = secondSelectedOpponent.value.username
            lowerEloPotentialGain = secondOpponentPotentialGain
            higherEloOpponentUsername = firstSelectedOpponent.value.username
            higherEloPotentialGain = firstOpponentPotentialGain
        }
        

        let data = {
            higherEloUsername: higherEloOpponentUsername,
            lowerEloUsername: lowerEloOpponentUsername,
            higherEloGainPotential: higherEloPotentialGain,
            lowerEloGainPotential: lowerEloPotentialGain

        }

        axios.post("/duels", data).then(
            res => {

                // fetch duels data 
                props.fetchData()
                handleClose()
        
            }
        ).catch(
            err => {

                console.log(err)
        
            }
        )
    }

    useEffect(() => {

        let firstOpponentUsername = firstSelectedOpponent ? firstSelectedOpponent.value.username : ""
        let secondOpponentUsername = secondSelectedOpponent ? secondSelectedOpponent.value.username : ""

        let secondSelectOptions = getOptionsList(firstOpponentUsername)
        setSecondSelectOptions(secondSelectOptions)

        let firstSelectOptions = getOptionsList(secondOpponentUsername)
        setFirstSelectOptions(firstSelectOptions)

        if (!firstSelectedOpponent || !secondSelectedOpponent) {
            // don't show potential elo gain/loss
            setShowPotentialEloChanges(false)
        } else {
            // both selected
            // calculate potential elo gain loss for both parties
            // show changes
            // first select menu should not include second selected's option
            // second select menu should not include first selected's option
            calculatePotentialEloChanges(firstSelectedOpponent.value, secondSelectedOpponent.value)
            setShowPotentialEloChanges(true)
        }


    },[firstSelectedOpponent, secondSelectedOpponent])



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
                
                <h3>New Duel</h3>
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    
                    <label  className='modal-label'>Player 1</label>

                     <Select

                        name="opponent-select"
                        options={firstSelectOptions}
                        className="opponent-select"
                        closeMenuOnSelect={true}
                        placeholder='Choose an opponent..'
                        value={firstSelectedOpponent}
                        onChange={(choice) => setFirstSelectedOpponent(choice)}
                        />

                    
                    {showPotentialEloChanges?
                        <div className='potential-elo-changes-container'>
                            <div className='modal-padding'></div>
                            <div>
                                <label className='modal-label'>{firstSelectedOpponent.value.name}'s Potential Gain</label>
                                <input className='elo-input' type='text' disabled={true} value={"+ " + firstOpponentPotentialGain}/>

                                <div className='modal-padding'></div>

                                <label className='modal-label'>{firstSelectedOpponent.value.name}'s Potential Loss</label>
                                <input className='elo-input' type='text' disabled={true} value={"- " + secondOpponentPotentialGain}/>
                            </div>

                        </div>
                    :""}

                    <div className='modal-padding'></div>


                    <label  className='modal-label'>Player 2</label>

                    <Select

                    name="opponent-select"
                    options={secondSelectOptions}
                    className="opponent-select"
                    closeMenuOnSelect={true}
                    placeholder='Choose an opponent..'
                    value={secondSelectedOpponent}
                    onChange={(choice) => setSecondSelectedOpponent(choice)}
                    />

            {showPotentialEloChanges?
            <div className='potential-elo-changes-container'>
                <div className='modal-padding'></div>
                <div>
                    <label className='modal-label'>{secondSelectedOpponent.value.name}'s potential Gain</label>
                    <input className='elo-input' type='text' disabled={true} value={"+ " + secondOpponentPotentialGain}/>

                    <div className='modal-padding'></div>

                    <label className='modal-label'>{secondSelectedOpponent.value.name}'s potential Loss</label>
                    <input className='elo-input' type='text' disabled={true} value={"- " + firstOpponentPotentialGain}/>
                </div>

            </div>
            :""}

            </Modal.Body>

            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            <Button variant="primary" onClick={()=>{handleCreate()}}>Confirm</Button>
            </Modal.Footer>
    </Modal>
    )
}