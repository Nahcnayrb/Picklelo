import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { Button } from '@mui/material';
// import 'bootstrap/dist/css/bootstrap.css';
export default function DuelsModal(props) {

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
        backdrop='static'>

            <Modal.Header className='modal-header'closeButton>
            <Modal.Title >
                
                <h3>New Duel</h3>
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    
                    <label className='amount-label'>Opponent</label>
                    <textarea 
                        id="story" 
                        name="story" 
                        rows="5" 
                        cols="35" 
                        placeholder='Ex. What is the Expense?'
                        >

                    
                    </textarea>

                    {/* <Select

                        isMulti='true'
                        name="involved-user-select"
                        options={this.state.selectOptions}
                        className="basic-multi-select"
                        closeMenuOnSelect={false}
                        blurInputOnSelect={false}
                        placeholder='select the people included in the expense'
                        value={this.state.involvedUsers}
                        onChange={(choice) => this.setState({involvedUsers: choice})}
                    /> */}

            </Modal.Body>

            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            <Button variant="primary">Next</Button>
            </Modal.Footer>
    </Modal>
    )
}