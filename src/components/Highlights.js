import ReactPlayer from 'react-player/youtube'
import DeleteIcon from '@mui/icons-material/Delete';
import Button from 'react-bootstrap/Button';

import { useState, useRef, useEffect} from "react";

export default function Highlights(props) {

    const playerRef = useRef([])
    const [activePlayerIndex, setActivePlayerIndex] = useState(-1);
    const [progressList, setProgressList] = useState([])

    useEffect(()=> {

        if (props && props.highlights) {
            setProgressList(new Array(props.highlights.length).fill(0))
        }
        

    },[props])

    function handleStart(index, startTime) {
        playerRef.current[index].seekTo(startTime,"seconds")
    }

    function handleProgress(state, index, startTime, endTime) {
        const { playedSeconds } = state;

        setProgressList(prev => {
            const copy = [...prev];
            // need % 1 here so that progress will never be at 100%
            // this is needed since there's a slight delay on the progress bar
            copy[index] = (playerRef.current[index].getCurrentTime() - startTime) / (endTime - startTime) % 1;
            return copy;
        });

        if (playedSeconds >= endTime) {
            playerRef.current[index].seekTo(startTime, "seconds");
            setActivePlayerIndex(index)
        }
    }


    // highlight prop
    // index
    if (!props.highlights) {
        return (<></>)
    }

    return (
    <>
    {props.highlights.map((highlight, i) => (
        <div className='highlight-container'>
            <div className='highlight-header'>
                <div className='highlight-pfps-container'>
                    {highlight.playerUsernames.map((username, j) => (
                        <img 
                            src={props.getPfp(props.playerMap.get(username))} 
                            className='highlight-pfp' 
                            style={{marginTop: "0.75rem"}}
                            onClick={()=>{props.setClickedPfpUsername(username)}}
                        ></img>
                    ))}
                </div>
                <label className='highlight-label'>{highlight.date.substring(0,10)}</label>
            </div>
            <label className='highlight-title-label'>{highlight.title}</label>
            <div className='player-container'>
                <ReactPlayer 
                    className='highlights-player' 
                    height={"100%"} width={"100%"}
                    ref={el => playerRef.current[i] = el}
                    playing={activePlayerIndex == i}
                    url={highlight.videoUrl}
                    onStart={()=>{handleStart(i, highlight.startTime)}} 
                    onProgress={(state)=>{handleProgress(state, i, highlight.startTime, highlight.endTime)}}
                    onPlay={()=>{setTimeout(()=>{setActivePlayerIndex(i)}, 50)}}
                />
            </div>
            <progress className='progress-bar' value={progressList[i]}/> 
            {!props.isLoggedIn || !props.isHighlightsDashboard ? "":
                <Button variant='light' style={{marginTop: "1rem"}} onClick={()=>{props.setSelectedHighlight(highlight); props.setShowDeleteModal(true)}}><DeleteIcon/></Button>
            }
            <div className='clipped-by-container'>
                <label className='highlight-label'>Clipped By: {props.playerMap.get(highlight.clipperUsername).name} </label>
            </div>
        </div>
    ))}
    </>
    )

}