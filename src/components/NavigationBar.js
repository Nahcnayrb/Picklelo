
import pickle from './pickle.png'
import logo from './picklelo-logo2.png'


export default function Navigationbar() {
// abc
    return <nav className="nav">
        <a href="#/" className="site-title">
            {/* <img src={pickle} width={60} height={60} style={{marginTop: "0.5rem", marginLeft: "0.5rem"}}/> */}
            <img className='nav-bar-logo' src={logo}/>
            {/* <h1 style={{marginTop: "1rem"}}>Picklelo</h1> */}

        </a>
    </nav>
}

