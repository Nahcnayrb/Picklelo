import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import Select from 'react-select'
import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.css';
export default function DuelsModal(props) {

    const gameModeSelections = [
        {
            value: 0,
            label: "Singles (1 vs. 1)"
        },
        {
            value: 1,
            label: "Doubles (2 vs. 2)"
        }
        ]

    const [firstSelectOptions, setFirstSelectOptions] = useState([]);
    const [secondSelectOptions, setSecondSelectOptions] = useState([]);
    const [thirdSelectOptions, setThirdSelectOptions] = useState([]);
    const [fourthSelectOptions, setFourthSelectOptions] = useState([]);

    const [firstSelectedOpponent, setFirstSelectedOpponent] = useState();
    const [secondSelectedOpponent, setSecondSelectedOpponent] = useState();
    const [thirdSelectedOpponent, setThirdSelectedOpponent] = useState();
    const [fourthSelectedOpponent, setFourthSelectedOpponent] = useState();

    const [showPotentialEloChanges, setShowPotentialEloChanges] = useState(false);
    const [secondOpponentPotentialGain, setSecondOpponentPotentialGain] = useState();
    const [firstOpponentPotentialGain, setFirstOpponentPotentialGain] = useState();
    const [gameModeOption, setGameModeOption] = useState(gameModeSelections[0]);
    const [playerOptions, setPlayerOptions] = useState([]);

    function handleClose() {
        setFirstOpponentPotentialGain("");
        setSecondOpponentPotentialGain("");

        clearPlayerSelections();
        setGameModeOption(gameModeOption[0]);
        props.setShow(false);
    }

    function clearPlayerSelections() {
        setFirstSelectedOpponent("");
        setSecondSelectedOpponent("");
        setThirdSelectedOpponent("");
        setFourthSelectedOpponent("");
        setShowPotentialEloChanges(false);
    }

    useEffect(() => {
        clearPlayerSelections();
    }, [gameModeOption]);

    useEffect(() => {
        setGameModeOption(gameModeSelections[0]);
        setFirstSelectOptions(playerOptions);
        setSecondSelectOptions(playerOptions);
        setThirdSelectOptions(playerOptions);
        setFourthSelectOptions(playerOptions);

    }, [props.show]);


    useEffect(()=> {

        
        let selections = [];
                    
        props.players.forEach((player) => {
            
            let option = {
                value: player,
                label: player.name + " (" + player.elo + ")"
            };
            selections.push(option);
            
        })

        selections.sort(function(a,b) {
            return b.value.elo - a.value.elo
        });
        
    
        setFirstSelectOptions(selections);
        setSecondSelectOptions(selections);
        setThirdSelectOptions(selections);
        setFourthSelectOptions(selections);
        setPlayerOptions(selections);
    
    },[props.players])

    useEffect(() => {
        // if any players are selected, update the selections for other selects
        if (!gameModeOption) {
            return;
        }
        
        const currentSelections = [firstSelectedOpponent, secondSelectedOpponent, thirdSelectedOpponent, fourthSelectedOpponent]
        const updatedSelections = playerOptions.filter(playerOption => !currentSelections.includes(playerOption));

        setFirstSelectOptions(updatedSelections);
        setSecondSelectOptions(updatedSelections);
        setThirdSelectOptions(updatedSelections);
        setFourthSelectOptions(updatedSelections);
        
        if (gameModeOption.value === 0) {
            // case singles
            if (!firstSelectedOpponent || !secondSelectedOpponent) {
                // don't show potential elo gain/loss
                setShowPotentialEloChanges(false)
            } else {
                // both selected
                // calculate potential elo gain loss for both parties
                // show changes
                // first select menu should not include second selected's option
                // second select menu should not include first selected's option
                calculatePotentialEloChanges(firstSelectedOpponent.value, secondSelectedOpponent.value);
                setShowPotentialEloChanges(true);
            }
        } else {
            // case doubles
            if (!firstSelectedOpponent || !secondSelectedOpponent || !thirdSelectedOpponent || !fourthSelectedOpponent) {
                // don't show potential elo gain/loss
                setShowPotentialEloChanges(false);
            } else {
                // both selected
                // calculate potential elo gain loss for both parties
                // show changes
                // first select menu should not include second selected's option
                // second select menu should not include first selected's option
                calculateDoublesPotentialEloChanges(firstSelectedOpponent.value, secondSelectedOpponent.value, thirdSelectedOpponent.value, fourthSelectedOpponent.value);
                setShowPotentialEloChanges(true);
            }
        }



    }, [firstSelectedOpponent, secondSelectedOpponent, thirdSelectedOpponent, fourthSelectedOpponent])

    function calculateDoublesPotentialEloChanges(firstOpponent, secondOpponent, thirdOpponent, fourthOpponent) {
        const team1AvgElo = (firstOpponent.elo + secondOpponent.elo) / 2;
        const team2AvgElo = (thirdOpponent.elo + fourthOpponent.elo) / 2;

        let eloDiff = Math.abs(team1AvgElo - team2AvgElo);
        let lowerEloTeamPotentialLoss = calculateLossPotential(eloDiff);
        let lowerEloTeamPotentialGain = calaculateGainPotential(eloDiff);

        if (team1AvgElo < team2AvgElo) {
            // team 1 lower elo
            setFirstOpponentPotentialGain(lowerEloTeamPotentialGain);
            setSecondOpponentPotentialGain(lowerEloTeamPotentialLoss);
        } else {
            // team 2 lower elo
            setFirstOpponentPotentialGain(lowerEloTeamPotentialLoss);
            setSecondOpponentPotentialGain(lowerEloTeamPotentialGain);
        }
    }

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
        let data = {};
        if (gameModeOption.value === 1) {
            // case doubles

            const team1Elo = firstSelectedOpponent.value.elo + secondSelectedOpponent.value.elo;
            const team2Elo = thirdSelectedOpponent.value.elo + fourthSelectedOpponent.value.elo;

            let lowerEloUsername = [];
            let higherEloUsername = [];
            let lowerEloPotentialGain = 0
            let higherEloPotentialGain = 0

            if (team1Elo < team2Elo) {
                // team 1 = lower elo
                lowerEloUsername.push(firstSelectedOpponent.value.username);
                lowerEloUsername.push(secondSelectedOpponent.value.username);
                lowerEloPotentialGain = firstOpponentPotentialGain

                higherEloUsername.push(thirdSelectedOpponent.value.username);
                higherEloUsername.push(fourthSelectedOpponent.value.username);
                higherEloPotentialGain = secondOpponentPotentialGain

            } else {
                higherEloUsername.push(firstSelectedOpponent.value.username);
                higherEloUsername.push(secondSelectedOpponent.value.username);
                lowerEloPotentialGain = secondOpponentPotentialGain;

                lowerEloUsername.push(thirdSelectedOpponent.value.username);
                lowerEloUsername.push(fourthSelectedOpponent.value.username);
                higherEloPotentialGain = firstOpponentPotentialGain;
            }

            data = {
                higherEloUsername: higherEloUsername,
                lowerEloUsername: lowerEloUsername,
                higherEloGainPotential: higherEloPotentialGain,
                lowerEloGainPotential: lowerEloPotentialGain,
                isDoublesMatch: true
            }


        } else {
            // case singles

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
            
    
            data = {
                higherEloUsername: [higherEloOpponentUsername],
                lowerEloUsername: [lowerEloOpponentUsername],
                higherEloGainPotential: higherEloPotentialGain,
                lowerEloGainPotential: lowerEloPotentialGain,
                isDoublesMatch: false
            }
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
                <label  className='modal-label'>Game Mode</label>
                <Select
                    name="opponent-select"
                    options={gameModeSelections}
                    className="opponent-select"
                    closeMenuOnSelect={true}
                    placeholder='Choose a game mode..'
                    value={gameModeOption}
                    onChange={(choice) => setGameModeOption(choice)}
                />
                <div className='modal-padding'></div>
                {gameModeOption?.value === 1
                    ?
                    <div>
                        <label className='modal-big-label'>Team 1</label>
                        <label  className='modal-label'>Player 1</label>

                        
                        <Select

                            name="opponent-select"
                            options={firstSelectOptions}
                            className="opponent-select"
                            closeMenuOnSelect={true}
                            placeholder='Choose a player..'
                            value={firstSelectedOpponent}
                            onChange={(choice) => setFirstSelectedOpponent(choice)}
                        />

                        <label  className='modal-label'>Player 2</label>

                        
                        <Select

                            name="opponent-select"
                            options={secondSelectOptions}
                            className="opponent-select"
                            closeMenuOnSelect={true}
                            placeholder='Choose a player..'
                            value={secondSelectedOpponent}
                            onChange={(choice) => setSecondSelectedOpponent(choice)}
                        />

                        <div className='modal-padding'></div>

                        {showPotentialEloChanges?
                            <div className='potential-elo-changes-container'>
                                <div className='modal-padding'></div>
                                <div>
                                    <label className='modal-label'>Team 1's potential Gain</label>
                                    <input className='elo-input' type='text' disabled={true} value={"+ " + firstOpponentPotentialGain}/>

                                    <div className='modal-padding'></div>

                                    <label className='modal-label'>Team 1's potential Loss</label>
                                    <input className='elo-input' type='text' disabled={true} value={"- " + secondOpponentPotentialGain}/>
                                </div>
                                <div className='modal-padding'></div>
                                <div className='modal-padding'></div>

                            </div>
                        :""}

                        <div className='modal-padding'></div>

                        <label  className='modal-big-label'>Team 2</label>

                        <label  className='modal-label'>Player 3</label>

                        
                        <Select

                            name="opponent-select"
                            options={thirdSelectOptions}
                            className="opponent-select"
                            closeMenuOnSelect={true}
                            placeholder='Choose a player..'
                            value={thirdSelectedOpponent}
                            onChange={(choice) => setThirdSelectedOpponent(choice)}
                        />

                        <label  className='modal-label'>Player 4</label>

                        
                        <Select

                            name="opponent-select"
                            options={fourthSelectOptions}
                            className="opponent-select"
                            closeMenuOnSelect={true}
                            placeholder='Choose a player..'
                            value={fourthSelectedOpponent}
                            onChange={(choice) => setFourthSelectedOpponent(choice)}
                        />

                        {showPotentialEloChanges?
                            <div className='potential-elo-changes-container'>
                                <div className='modal-padding'></div>
                                <div>
                                    <label className='modal-label'>Team 2's potential Gain</label>
                                    <input className='elo-input' type='text' disabled={true} value={"+ " + secondOpponentPotentialGain}/>

                                    <div className='modal-padding'></div>

                                    <label className='modal-label'>Team 2's potential Loss</label>
                                    <input className='elo-input' type='text' disabled={true} value={"- " + firstOpponentPotentialGain}/>
                                </div>

                                <div className='modal-padding'></div>
                                <div className='modal-padding'></div>

                            </div>
                        :""}
                    </div>
                    :
                    <div>
                        <label  className='modal-label'>Player 1</label>

                        <Select

                            name="opponent-select"
                            options={firstSelectOptions}
                            className="opponent-select"
                            closeMenuOnSelect={true}
                            placeholder='Choose a player..'
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
                            placeholder='Choose a player..'
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
                    </div>
                }
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