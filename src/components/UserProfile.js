import { useEffect } from "react"
import { useState } from 'react'
import { Button } from '@mui/material'
import pfp from "./0140.png"

export default function UserProfile(props) {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")


    useEffect(()=> {

        if (props.user) {

            setEmail(props.user.email)
            setName(props.user.name)
        }


    
      },[props.user])

      // name(editable), username(locked), email(locked), profile picture(editable)

    

    return (
        <div>
            

            <div className='auth-wrapper'>
                <div className='auth-inner'>
                    {props.user
                    ?
                    <div className="form-group">

                        <h3>My Profile</h3>

                        <label className="form-label">Name</label>
                        <input type='text' className="form-control" placeholder="" value={name} onChange={(e) => setName(e.target.value)}/>
                    
                        <div className="form-padding"/>

                        <label className="form-label">Username</label>
                        <input type='text' className="form-control" placeholder="" disabled value={props.user.username} />

                        <div className="form-padding"/>


                        <label className="form-label">Email</label>
                        <input type='text' className="form-control" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <div className="form-padding"/>
                        <label className="form-label">Profile Picture</label>
                        <div style={{display: "inline-block"}}>
                            <img src={pfp} className='pfp' style={{marginTop: "0.5rem"}}></img>
                            <input type='file' style={{width: "100px", marginLeft: "20px"}}></input>
                        </div>
                        
                        <div className="form-padding"/>
                        <div className="form-padding"/>
                        <Button type="submit" variant="contained" style={{backgroundColor: "#006400", width: "110px", marginLeft: "2.8rem"}}>
                                <label className='form-label' style={{cursor: "pointer", paddingTop: "8px"}}>SAVE</label>
                        </Button>
                    </div>
                    :""}
                </div>
            </div>

        </div>
    )
}