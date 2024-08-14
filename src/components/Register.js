import { Button } from '@mui/material'
import { useState } from 'react'
import axios from 'axios'
import Alert from '@mui/material/Alert'
import { Navigate } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [confirmPasswordError, setConfirmPasswordError] = useState("")
    const [registered, setRegistered] = useState(false)

    function handleSubmit(event) {
        event.preventDefault()

        let regex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/
        let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        
        let currUsernameError = ""
        let currNameError = ""
        let currEmailError = ""
        let currPasswordError = ""
        let currConfirmPasswordError = ""


        if (!username) {
            currUsernameError = "Username cannot be empty."


        } else if (regex.test(username)) {
            currUsernameError = "Username cannot contain special characters."

        }

        if (!name) {
            currNameError = "Name cannot be empty."
            
        }
        if (!emailRegex.test(email)) {
            currEmailError = "Email provided is invalid."
        }

        if (!password || password.length < 6) {
            currPasswordError = "Password cannot be less than 6 characters."

        }

        if (password !== confirmPassword) {
            currConfirmPasswordError = "Passwords do not match."
        }


        // if (usernameError || nameError || emailError || passwordError || confirmPasswordError) {
        //     return
        // }

        setUsernameError(currUsernameError)
        setNameError(currNameError)
        setEmailError(currEmailError)
        setPasswordError(currPasswordError)
        setConfirmPasswordError(currConfirmPasswordError)

        if (currUsernameError || currNameError || currEmailError || currPasswordError || currConfirmPasswordError) {
            return
        }

        // at this point, given data is valid and ready to generate request

        let accountData = {
            name: name,
            username: username,
            email: email,
            password: password
        }

        axios.post("/players", accountData).then(
            res => {
                console.log("register account api call")
                setRegistered(true)
                alert("Your account was successfully created!")
            }
        ).catch(
            err => {
                if (err.response.status === 400) {
                    setUsernameError("Username is already taken.")

                } else if (err.response.status === 401) {
                    setEmailError("Email is already taken.")
                }
            }
        )






    }

    if (registered) {
        return <Navigate to={'/login'}/> 
    }

    return (
        <div className='auth-wrapper'>
            <div className='auth-inner'>
                <form onSubmit={handleSubmit}>
                    <h3>Register New Player</h3>
                    <div className="form-group">
                        {nameError?<Alert severity="error">{nameError}</Alert>:""}
                        <label className="form-label">Full Name</label>
                        <input type='text' className="form-control" placeholder="Ex. Hugh Jazz" value={name} onChange={(e) => setName(e.target.value)}/>
                    
                        <div className="form-padding"/>

                        {usernameError?<Alert severity="error">{usernameError}</Alert>:""}

                        <label className="form-label">Username</label>
                        <input type='text' className="form-control" placeholder="Ex. adarn" value={username} onChange={(e) => setUsername(e.target.value)}/>

                        <div className="form-padding"/>

                        {emailError?<Alert severity="error">{emailError}</Alert>:""}
                        <label className="form-label">Email</label>
                        <input type='text' className="form-control" placeholder="hughjazz@example.com" value={email} onChange={(e) => setEmail(e.target.value)}/>

                        <div className="form-padding"/>

                        {passwordError?<Alert severity="error">{passwordError}</Alert>:""}

                        <label className="form-label">Password</label>
                        <input type='password' className="form-control" value={password} onChange={(e) => setPassword(e.target.value)}/>

                        <div className="form-padding"/>

                        {confirmPasswordError?<Alert severity="error">{confirmPasswordError}</Alert>:""}

                        <label className="form-label">Confirm Password</label>
                        <input type='password' className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                        <div className="form-padding"/>
                        <Button type="submit" variant="contained" style={{backgroundColor: "#006400", width: "110px"}}>
                                <label className='form-label' style={{cursor: "pointer"}}>Sign Up!</label>
                        </Button>
                    </div>
                </form>

            </div>
        </div>
    )
}