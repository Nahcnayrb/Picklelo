import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from "react-router-dom"
import './Sidebar.css';
import { Leaderboard, SportsKabaddi, ThumbDown, Groups} from '@mui/icons-material';
import { useState } from 'react';
export default props => {

  const [isOpen, setOpen] = useState(false)

  const handleIsOpen = () => {
    setOpen(!isOpen)
  }

  function handleLogout() {

    localStorage.removeItem("token")
    props.setIsLoggedIn(false)
    handleIsOpen()


  }

  return (
    <Menu  
    isOpen={isOpen}
    onOpen={handleIsOpen}
    onClose={handleIsOpen} right width={'225px'}>
      <a className="menu-item" href="#/" onClick={handleIsOpen}>
        Home
      </a>
      <a className="menu-item" href="#/leaderboard" onClick={handleIsOpen}>
        Leaderboard
        <Leaderboard fontSize="medium" style={{marginLeft: "5px", paddingTop: "7px"}}/>
      </a>
      <a className="menu-item" href="#/tournaments" onClick={handleIsOpen}>
        Tournaments
        <Groups fontSize="medium" style={{marginLeft: "5px", paddingTop: "7px"}}/>
      </a>
      <a className="menu-item" href="#/duels" onClick={handleIsOpen}>
        Duels
        <SportsKabaddi fontSize="medium" style={{marginLeft: "5px", paddingTop: "7px"}}/>
      </a>

      <a className="menu-item" href="#/pickled" onClick={handleIsOpen}>
        Pickled List
        <ThumbDown fontSize="medium" style={{marginLeft: "5px", paddingTop: "7px"}}/>
      </a>

      <div className='padding'/>

      <div className='horizontal-bar'/>

      <div className='padding'/>

      {props.user?<label style={{fontSize: "20px", color: "white"}}>{props.user.name}</label>:""}


      {props.isLoggedIn?
      <a className="menu-item" href="#/profile" onClick={handleIsOpen}>
        My Profile
      </a>
      :""}
      {props.isLoggedIn?
      <a className="menu-item" href="#/login" onClick={handleLogout}>
        Log Out
      </a>
      :""}

    {!props.isLoggedIn?
      <a className="menu-item" href="#/login" onClick={handleIsOpen}>
      Log in
    </a>
    :""}
    {!props.isLoggedIn?
    <a className="menu-item" href="#/register" onClick={handleIsOpen}>
      Sign up
    </a>
    :""}

    </Menu>
  );
  


};