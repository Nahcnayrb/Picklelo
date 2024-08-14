import { Link } from "react-router-dom"
import { Button } from '@mui/material'
import { useState } from "react"
import axios from "axios"
import Alert from '@mui/material/Alert'
import { Navigate } from "react-router-dom";

export default function Login() {

    const [key, setKey] = useState("")
    const [password, setPassword] = useState("")
    const [loginError, setLoginError]  = useState("")
    const [loggedIn, setLoggedIn] = useState(false)


    function handleSubmit(event) {
        event.preventDefault()


        let credentials = {
            key: key,
            password: password
        }

        axios.post("/login", credentials).then(
            res => {
                let token = res.data
                localStorage.setItem("token", token)
                setLoggedIn(true)
                setTimeout(()=>{window.location.reload()},50)
            }
        ).catch(
            err => {
                if (err.response.status === 404) {
                    setLoginError("Username or password is incorrect.")
                }
            }
        )



    }

    if (loggedIn) {
        return <Navigate to={'/'}/> 
    }

    return (
        <div className='auth-wrapper'>
            <div className='auth-inner'>
                <form onSubmit={handleSubmit}>
                    <h3>Sign In</h3>
                    <div className="form-group">
                        {loginError?<Alert severity="error">{loginError}</Alert>:""}
                        <label className="form-label">Email / Username</label>
                        <input type='text' className="form-control" value={key} onChange={(e) => {setKey(e.target.value)}}/>

                        <div className="form-padding"/>

                        <label className="form-label">Password</label>
                        <input type='password' className="form-control" value={password} onChange={(e) => {setPassword(e.target.value)}} />
                        <div className="form-padding"/>
                        <a className="forgot-password" href="/forgot-password">Forgot Password? </a>


                        <div className="form-padding"></div>
                        <Button type="submit" variant="contained" style={{backgroundColor: "#006400", width: "100px"}}>
                                <label className='form-label' style={{cursor: "pointer"}}>Log In</label>
                        </Button>
                        </div>

                </form>

            </div>
        </div>
    )
}