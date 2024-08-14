import { Link } from "react-router-dom"

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import pickle from './pickle.png'
import {useState} from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import { Menu } from "@mui/material";
import Sidebar from "./Sidebar";

export default function Navigationbar() {


    const [menuIsOpen, setMenuIsOpen] = useState()


    function setShow() {
        if (menuIsOpen) {
            setMenuIsOpen(false)
        } else {
            setMenuIsOpen(true)
        }

    }

    return <nav className="nav">
        <a href="/" className="site-title">
            <img src={pickle} width={60} height={60}/>
            <h1>Picklelo</h1>

        </a>
    </nav>
}

