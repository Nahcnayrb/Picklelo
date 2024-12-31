import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';

export default function WatchModal(props) {

    const [playerMap, setPlayerMap] = useState()
    const [duel, setDuel] = useState()
    const [videoId, setVideoId] = useState("")
    

    useEffect(()=>{
        if (props && props.duel) {
            setPlayerMap(props.playerMap)
            setDuel(props.duel)
            const videoUrl = props.duel.videoUrl
            setVideoId(getYoutubeVideoId(videoUrl))
        }

    },[props]);

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

    function handleClose() {
        props.setShow(false)
    }

    return (

        <Modal
        className='duels-modal'
        show={props.show}
        onHide={handleClose}
        keyboard={false}
        size='xl'
        >

            <Modal.Header className='modal-header'closeButton>
            <Modal.Title >
                {duel?
                <h3>{playerMap.get(duel.lowerEloUsername).name + " vs. " + playerMap.get(duel.higherEloUsername).name}</h3>    
                :""}
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {videoId?
                <iframe className="video-player" allow="fullscreen;"
                src={"https://www.youtube.com/embed/" + videoId +  "?controls=1"}>
                </iframe>
                :""}

            </Modal.Body>

            <Modal.Footer>
            </Modal.Footer>
    </Modal>

    )
}