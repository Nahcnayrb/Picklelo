
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';

export default function DeleteHighlightModal(props) {

    const [highlight, setHighlight] = useState()

    function handleClose() {
        props.setShow(false)
    }
    
    async function handleConfirm() {

        const res = await axios.delete("/highlights/" + highlight._id)

        await props.fetchData()
        
        handleClose()

    }

    useEffect(()=>{
        if (!props.playerMap || props.playerMap.length == 0) {
            return
        } else {
            // case props ready
            setHighlight(props.highlight);
        }

    },[props])


    if (!highlight) {
        return (<></>)
    } else {
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

                <h3>{props.highlight.title}</h3>

                
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                <label style={{ fontSize: "20px"}}>Are you sure you want to delete '{props.highlight.title}'?
                </label>


               

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
}