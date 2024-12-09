import { useEffect } from "react"
import { useState } from 'react'
import { Button } from '@mui/material'
import pfp from "./0140.png"
import defaultpfp from "./0617.png"

export default function UserProfile(props) {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [profilePicture, setProfilePicture] = useState()


    useEffect(()=> {

        if (props.user) {

            setEmail(props.user.email)
            setName(props.user.name)
            setProfilePicture(pfp)
        }


    
        },[props.user]
    )

    let handleFileChange = (e) => {

        if (e.target.files[0]) {
            
            
            let file = URL.createObjectURL(e.target.files[0])
            console.log(e.target.files[0].type)
            console.log(file)
            setProfilePicture(file)

            

        } else {
            // case no file provided
            // update file state
            // setProfilePicture()
        }

    }


    


    


    

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
                        <div style={{display: "flex"}}>
                            <img src={!profilePicture?defaultpfp:profilePicture} className='pfp' style={{marginTop: "0.5rem"}}></img>
                            <div style={{width: "150px", marginLeft: "20px", marginTop: "15px"}}>
                            <input type='file' style={{width: "100px", marginLeft: "20px"}} onChange={e => handleFileChange(e)}></input>
                            <input type='button' 
                                disabled={!profilePicture} 
                                value={"Remove Picture"} 
                                style={{width: "150px", marginTop: "20px"}}
                                onClick={e => setProfilePicture()}
                            ></input>
                            </div>
                        </div>
                        
                        <div className="form-padding"/>
                        <div className="form-padding"/>
                        <Button type="submit" variant="contained" style={{backgroundColor: "#006400", width: "110px", marginLeft: "4.7rem"}}>
                                <label className='form-label' style={{cursor: "pointer", paddingTop: "8px"}}>SAVE</label>
                        </Button>
                    </div>
                    :""}
                </div>
            </div>

        </div>
    )
}