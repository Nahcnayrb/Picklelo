
import pickle from './pickle.png'


export default function Navigationbar() {
// abc
    return <nav className="nav">
        <a href="#/" className="site-title">
            <img src={pickle} width={60} height={60}/>
            <h1>Picklelo</h1>

        </a>
    </nav>
}

