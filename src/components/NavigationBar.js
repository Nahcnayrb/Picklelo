import logo from "../assets/picklelo-logo2.png";


export default function Navigationbar() {
// abc
    return <nav className="nav">
        <a href="#/" className="site-title">
            <img className='nav-bar-logo' src={logo}/>
        </a>
    </nav>
}

