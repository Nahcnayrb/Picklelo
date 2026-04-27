import { useEffect } from "react"
import { useState } from 'react'
import { Button } from '@mui/material'
import defaultpfp from "../assets/defaultpfp.png";
import Alert from '@mui/material/Alert'
import imageCompression from 'browser-image-compression';
import axios from "axios"

export default function UserProfile(props) {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [profilePicture, setProfilePicture] = useState()
    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [pfpError, setPfpError] = useState("")
    const [status, setStatus] = useState()
    const [pfpUploadStatus, setPfpUploadStatus] = useState()
    const [disableSave, setDisableSave] = useState(false)
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const [pfpIsDefault, setPfpIsDefault] = useState(true)

    useEffect(()=> {

        if (props.user && props.pfpMap) {

            setEmail(props.user.email)
            setName(props.user.name)
            setProfilePicture(getPfp(props.user))
        }
    
        },[props]
    )

    function getPfp(player) {
        if (!player.hasPfp || !process.env.REACT_APP_BLOB_STORAGE_URL) {
            setPfpIsDefault(true)
            return defaultpfp;
        } else {
            // case has pfp
            setPfpIsDefault(false)
            // return props.pfpMap.get(player.username);
            return process.env.REACT_APP_BLOB_STORAGE_URL + player.username + "?m=" + Date.now().toString();
        }
    }

    async function handleFileChange(e) {
        let originalFile = e.target.files[0]

        if (originalFile) {
            //TODO:  compress image to specific size
            
            const imageFile = originalFile
            if ((originalFile.type === "image/png") || (originalFile.type === "image/jpeg")) {

                setPfpUploadStatus("Uploading...")

                const options = {
                    maxSizeMB: 0.5,
                    maxWidthOrHeight: 1024,
                    useWebWorker: true,
                }



                const compressedFile = await imageCompression(imageFile, options);

                const file = URL.createObjectURL(compressedFile)
                setProfilePicture(file)
                setPfpIsDefault(false)

                setPfpUploadStatus("Uploaded!")
            } else {
                // don't go through compression process if pfp is not a valid image
                setProfilePicture(URL.createObjectURL(imageFile))

            }


            

        }
    }


    async function handleSave() {
        setStatus() // refresh save status

        // case user puts in non jpg/png file (determined by file.type)
        // show pfp error 
        let pfp = {};
        const username = props.user.username;

        let data = {
            name: name,
            email: email,
            hasPfp: false
        }

        if ((profilePicture) && (!pfpIsDefault)) {
            // case pfp exists
            data.hasPfp = true
            await fetch(profilePicture).then(
                r => r.blob()).then(
                    blobFile => {
                        pfp = new File([blobFile], "file", { type: blobFile.type})
                    })
        }


        let currNameError = ""
        let currEmailError = ""
        let currPfpError = ""

        if (!emailRegex.test(email)) {
            // case email invalid
            currEmailError = "Email provided is invalid."
        }

        if (name.trim().length === 0) {
            // case empty name exluding whitespaces
            currNameError = "Name cannot be empty."
        }

        if ((data.pfp) && (data.pfp.type !== "image/png") && (data.pfp.type !== "image/jpeg")) {
            currPfpError = "Profile Picture must be one of .jpeg or .png"
        } 

        // make update request

        setNameError(currNameError)
        setEmailError(currEmailError)
        setPfpError(currPfpError)

        if (!currEmailError && !currNameError && !currPfpError) {
            // passed validation
            // at this point, pfp is for sure < 0.5 mb
            // all data are valid

            // disable save button until api call is complete, so user can't spam api requests
            setStatus("Saving")
            setDisableSave(true)

            if ((profilePicture) && (!pfpIsDefault)) {

                console.log('about to upload pfp')
                let url = '/pfps/' + username;

                let formData = new FormData();
                formData.append('file', pfp)
                let config = {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }
    
                await axios.put(url, formData, config).then(
                    res => {
                    }
                ).catch(
                    err => {
                        console.log(err.response)
                    }
                )


                // at this point, the pfp has been uploaded successfully onto cloud storage
                // update user data to reflect new changes
            }

            await axios.put("/players/" + username, data).then(
                res => {
                    console.log("updated player");
                    setStatus("Saved");

                    props.fetchData();

                }
            ).catch(
                err => {
                    console.log(err.response);
                }
            );

            setTimeout(()=>{
                // prevent save button from being clicked multiple times by delaying it from enabling again
                // in case the put request finishes really fast
                setDisableSave(false)

            }, 2000)

        }


    } 


    


    


    

    return (
        <div>
            

            <div className='auth-wrapper'>
                <div className='auth-inner'>
                    {props.user
                    ?
                    <div className="form-group">
                        {status
                        ?<>
                            {status === "Saving"?<Alert severity="info">{status}</Alert>:<Alert severity="success" onClose={() => {setStatus()}}>{status}</Alert>}
                            <div className="form-padding"/>
                        </>
                        :""}
                        
                        <h3>My Profile</h3>

                        <label className="form-label">Name</label>
                        {nameError?<Alert severity="error">{nameError}</Alert>:""}
                        <input type='text' className="form-control" placeholder="" value={name} onChange={(e) => setName(e.target.value)}/>
                    
                        <div className="form-padding"/>

                        <label className="form-label">Username</label>
                        <input type='text' className="form-control" placeholder="" disabled value={props.user.username} />

                        <div className="form-padding"/>


                        <label className="form-label">Email</label>
                        {emailError?<Alert severity="error">{emailError}</Alert>:""}
                        <input type='text' className="form-control" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <div className="form-padding"/>
                        <label className="form-label">Profile Picture</label>
                        {pfpError?<Alert severity="error">{pfpError}</Alert>:""}
                        {pfpUploadStatus
                        ?<>
                            {pfpUploadStatus === "Uploading..."?<Alert severity="info">{pfpUploadStatus}</Alert>:<Alert severity="success" onClose={() => {setPfpUploadStatus()}}>{pfpUploadStatus}</Alert>}
                            <div className="form-padding"/>
                        </>
                        :""}
                        <div style={{display: "flex"}}>
                            <img src={!profilePicture?defaultpfp:profilePicture} className='pfp' style={{marginTop: "0.5rem"}}></img>
                            <div style={{width: "150px", marginLeft: "20px", marginTop: "15px"}}>
                            <input type='file' style={{width: "100px", marginLeft: "20px"}} onChange={e => handleFileChange(e)}></input>
                            <input type='button' 
                                disabled={!profilePicture || pfpIsDefault} 
                                value={"Remove Picture"} 
                                style={{width: "150px", marginTop: "20px"}}
                                onClick={e => {setProfilePicture(); setPfpUploadStatus();setPfpIsDefault(true)}}
                            ></input>
                            </div>
                        </div>
                        
                        <div className="form-padding"/>
                        <div className="form-padding"/>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            style={{backgroundColor: "#262525", width: "110px", marginLeft: "4.7rem"}}
                            disabled={disableSave}
                            onClick={handleSave}>
                                <label className='form-label' style={{cursor: "pointer", paddingTop: "8px"}}>SAVE</label>
                        </Button>
                    </div>
                    :""}
                </div>
            </div>

        </div>
    )
}