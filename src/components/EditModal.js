import { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import { Button } from '@mui/material';
import axios from 'axios';
import Alert from '@mui/material/Alert'

export default function EditModal(props) {

    const [duel, setDuel] = useState()
    const [videoUrl, setVideoUrl] = useState("")
    const [urlError, setUrlError] = useState("")

    const videoUrlRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/

    useEffect(()=>{
        if (props && props.duel) {
            setDuel(props.duel);

            setVideoUrl(props.duel.videoUrl);
        }

    },[props]);

    async function handleSave() {
        const currentVideoUrl = videoUrl.trim()

        if (currentVideoUrl && !videoUrlRegex.test(currentVideoUrl)) {
            setUrlError("Youtube URL is invalid.")
            return;
        }

        console.log("clicked save")
        if ((currentVideoUrl) || ((currentVideoUrl === "") && (duel.videoUrl))) {

            let duelData = {
                videoUrl: currentVideoUrl
            }
    
            await axios.put("/duels/" + duel._id, duelData)
            console.log("saved video url")
            window.location.reload()

        }
        props.setShow(false)

    }
    
    function handleClose() {
        setUrlError()
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

                <h3>Edit Replay Link</h3>    
                
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <label>Youtube URL</label>
                {urlError?<Alert severity="error">{urlError}</Alert>:""}
                <input 
                    type='text' 
                    className="form-control" 
                    value={videoUrl?videoUrl:""} 
                    onChange={(e) => setVideoUrl(e.target.value)}
                />

            </Modal.Body>

            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            <Button variant="primary" onClick={() => {handleSave()}}>Save</Button>
            </Modal.Footer>
    </Modal>

    )

}