import Modal from 'react-bootstrap/Modal';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@mui/material';
import Select from 'react-select'
import axios from 'axios';
import ReactPlayer from 'react-player/youtube'
import Alert from '@mui/material/Alert'


export default function HighlightsModal(props) {

    const [playerOptions, setPlayerOptions] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState()
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [validatedYoutubeUrl, setValidatedYoutubeUrl] = useState("")
    const [startTimeMin, setStartTimeMin] = useState(0)
    const [startTimeSec, setStartTimeSec] = useState(0)
    const [endTimeMin, setEndTimeMin] = useState(0)
    const [endTimeSec, setEndTimeSec] = useState(1)
    const previewRef = useRef(null)
    const [playing, setPlaying] = useState(false)
    const [title, setTitle] = useState("")
    const [urlError, setUrlError] = useState("")
    const [titleError, setTitleError] = useState("")
    const [playerSelectionError, setPlayerSelectionError] = useState("")
    const [timeError, setTimeError] = useState("")
    const [duration, setDuration] = useState(1)
    

    function handleClose() {
        props.setShow(false);
        setYoutubeUrl("")
        setStartTimeMin(0)
        setStartTimeSec(0)
        setEndTimeMin(0)
        setEndTimeSec(0)
        setValidatedYoutubeUrl("")
        setTitle("")
        setSelectedPlayers()
    }

    function getYoutubeVideoId(url) {
        if (!url) {
            return ""
        }
        const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return ""
        }
    }

    useEffect(() => {
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
   
        setPlayerOptions(selections);
    }, [props.players])

    function handlePreviewReady() {
        if (validatedYoutubeUrl != "") {
            // setMin(0);
            // setMax(300);
            const duration = previewRef.current.getDuration();
            setStartTimeSec(0)
            setStartTimeMin(0)
            setEndTimeSec(Math.floor(duration % 60))
            setEndTimeMin(Math.floor(duration / 60))
            setDuration(duration)
        }
    }

    useEffect(()=>{
        if (validatedYoutubeUrl && playing) {
            previewRef.current.seekTo(Number(startTimeMin)* 60 + Number(startTimeSec));
        }


    },[startTimeSec, startTimeMin, endTimeMin, endTimeSec])


    const validateYoutubeUrl = (url) => {

        const videoId = getYoutubeVideoId(url);

        const youtubeUrl = 'https://www.youtube.com/watch?v=' + videoId

        if (ReactPlayer.canPlay(youtubeUrl)) {
            
            setValidatedYoutubeUrl(youtubeUrl)
            setUrlError("")
        } else {
            setUrlError("the provided youtube Url is invalid")
        }

    }

    function handleProgress(state) {
        const { playedSeconds } = state;

        const endTimeInSeconds =  Number(endTimeMin) * 60 +  Number(endTimeSec);
        const startTimeInSeconds = Number(startTimeMin) * 60 + Number(startTimeSec);

        if (playedSeconds >= endTimeInSeconds) {
            previewRef.current.seekTo(startTimeInSeconds, "seconds");
            setTimeout(() => {
                setPlaying(true); // Set playing to true after seeking
              }, 50); // Adjust the delay if necessary
        }
    }

    function handleStart() {
        const startTimeInSeconds = startTimeMin * 60 + startTimeSec;
        previewRef.current.seekTo(startTimeInSeconds,"seconds")
        setPlaying(false)
        setTimeout(() => {
            setPlaying(true) // Set playing to true after seeking

          }, 50);
    }

    function handleCreate() {

        // validate fields

        // get player usernames from current selections
        let errors = 0;

        if (!validatedYoutubeUrl) {
            // case given url is invalid
            setUrlError("the provided youtube Url is invalid")
            errors++;
        } else {
            setUrlError("")
        }

        if (!selectedPlayers || selectedPlayers.length === 0) {
            setPlayerSelectionError("at least one player must be tagged")
            errors++;
        } else {
            setPlayerSelectionError("")
        }

        if (!title) {
            setTitleError('title cannot be empty.')
            errors++;
        } else {
            setTitleError('')
        }

        const startTimeInSecs = Number(startTimeMin) * 60 + Number(startTimeSec)
        const endTimeInSecs = Number(endTimeMin) * 60 + Number(endTimeSec)

        if (endTimeInSecs > duration) {
            setTimeError('end time cannot exceed the video duration')
            errors++;
        } else {
            setTimeError('')
        }

        if (startTimeInSecs >= endTimeInSecs) {
            setTimeError('start time cannot be greater or equal to the end time')
            errors++;
        } else {
            setTimeError('')
        }

        if (errors > 0) {
            return;
        }

        const playerUsernames = Array.from(selectedPlayers.map((player) => player.value.username));

        const data = {
            videoUrl: validatedYoutubeUrl,
            playerUsernames: playerUsernames,
            clipperUsername: props.user.username,
            title: title,
            startTime: startTimeInSecs,
            endTime: endTimeInSecs
        }

        axios.post("/highlights", data).then(
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
                <h3>New Highlight</h3>
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='modal-padding'></div>
            <div>
                <div className='field-container'>
                    {urlError?<Alert severity="error">{urlError}</Alert>:""}
                     <label className='modal-label'>Youtube URL:</label>
                     <input 
                    type='text' 
                    className="form-control" 
                    style={{width: "20rem"}}
                    value={youtubeUrl}
                    onChange={(e)=>{setYoutubeUrl(e.target.value); validateYoutubeUrl(e.target.value)}}
                    // onBlur={(e)=>{validateYoutubeUrl(e.target.value)}}
                    />
                </div>
                <div className='modal-padding'></div>
                {playerSelectionError?<Alert severity="error">{playerSelectionError}</Alert>:""}
                <div className='modal-padding'></div>
                <label className='modal-label'>Highlighted Players</label>
                <Select
                    options={playerOptions}
                    isMulti
                    value={selectedPlayers}
                    onChange={(choices) => {setSelectedPlayers(choices); setPlayerSelectionError("")}}
                />
                <div className='modal-padding'></div>

                {titleError?<Alert severity="error">{titleError}</Alert>:""}
                <div className='modal-padding'></div>
                <label className='modal-label'>Highlight Title</label>
                <input 
                    type='text' 
                    className="form-control" 
                    maxLength="55"
                    value={title}
                    onChange={(e) => {setTitle(e.target.value); setTitleError("")}}
                    // value={videoUrl?videoUrl:""} 
                    // onChange={(e) => setVideoUrl(e.target.value)}
                />
                <div className='modal-padding'></div>
                {validatedYoutubeUrl 
                ? 
                <>
                    <label className='modal-label'>Full Video</label>
                    <ReactPlayer height={200} width={350} controls={true} url={validatedYoutubeUrl}/>
                    <div className='modal-padding'></div>
                    <div className='modal-padding'></div>
                    {timeError?<Alert severity="error">{timeError}</Alert>:""}
                    <div className='modal-padding'></div>
                    <label className='modal-label'>Set Start Time</label>
                    <div className='timestamp-container'>
                        <input type='tel' 
                            pattern="[0-9]*"
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                                }
                            }}
                            maxLength={2}
                            style={{width:"35px"}}
                            value={startTimeMin}
                            onChange={(e)=>{setStartTimeMin(e.target.value.replace(/^0+/, '')); setTimeError("")}}
                        />
                        min
                        {/* <label className='modal-label'>:</label> */}
                        <input type='tel' 
                            pattern="[0-9]*"
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                                }
                            }}
                            maxLength={2}
                            style={{width:"35px"}}
                            value={startTimeSec}
                            onChange={(e)=>{setStartTimeSec(e.target.value.replace(/^0+/, '')); setTimeError("")}}
                        />
                        sec
                    </div>
                    <div className='modal-padding'></div>
                    <label className='modal-label'>Set End Time</label>
                    <div className='timestamp-container'>
                        <input type='tel' 
                            pattern="[0-9]*"
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                                }
                            }}
                            maxLength={2}
                            style={{width:"35px"}}
                            value={endTimeMin}

                            onChange={(e)=>{setEndTimeMin(e.target.value.replace(/^0+/, '')); setTimeError("")}}
                        />
                        min
                        <input type='tel' 
                            pattern="[0-9]*"
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                                }
                            }}
                            maxLength={2}
                            style={{width:"35px"}}
                            value={endTimeSec}

                            onChange={(e)=>{setEndTimeSec(e.target.value.replace(/^0+/, '')); setTimeError("")}}
                        />
                        sec
                    </div>

                    <div className='modal-padding'></div>

                    <label className='modal-label'>Preview Highlight</label>

                    <ReactPlayer 
                        className='highlights-player' 
                        height={200} width={350}  
                        ref={previewRef} 
                        playing={playing} 
                        muted={!playing} 
                        url={validatedYoutubeUrl} 
                        onStart={()=>{handleStart(0)}} 
                        onProgress={(state)=>{handleProgress(state, 0)}}
                        onReady={handlePreviewReady}
                    />
                    

                    <div className='modal-padding'></div>
                </>
                :
                ""
            }

            </div>
            </Modal.Body>

            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate}>Confirm</Button>
            </Modal.Footer>
    </Modal>
    )
}