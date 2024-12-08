import { useParams } from 'react-router-dom';

export default function Profile() {
    const { username } = useParams()
    console.log(username)


    return (


            <div className='auth-wrapper'>
                <div className='auth-inner' style={{marginTop: "5rem"}}>
    
                    <h1 style={{textAlign: "center"}}>{username}</h1>
                
                </div>

                <div className='auth-inner' style={{marginTop: "5rem"}}>
    
                    <h1 style={{textAlign: "center"}}>Match History feature is coming Soon :)</h1>

                </div>
            </div>
    
        
    )

}