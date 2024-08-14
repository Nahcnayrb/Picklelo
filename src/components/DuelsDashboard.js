
import { Button } from "@mui/material";
import DuelsModal from "./DuelsModal";
import { useState } from "react";

export default function DuelsDashboard() {

    const [showModal, setShowModal] = useState(false)

    return (
        <div>
            <Button onClick={()=>{setShowModal(true)}}>New Duel</Button>

        <DuelsModal show={showModal} setShow={setShowModal}/>
        </div>

    )
}



