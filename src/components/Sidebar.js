import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from "react-router-dom"
import './Sidebar.css';
import { Leaderboard, SportsKabaddi, ThumbDown, Groups} from '@mui/icons-material';
export default props => {
  function handleLogout() {

    localStorage.removeItem("token")
    props.setIsLoggedIn(false)


  }

  return (
    <Menu right width={'225px'}>
      <a className="menu-item" href="/">
        Home
      </a>
      <a className="menu-item" href="/leaderboard">
        Leaderboard
        <Leaderboard fontSize="medium" style={{marginLeft: "5px", paddingTop: "7px"}}/>
      </a>
      <a className="menu-item" href="/tournaments">
        Tournaments
        <Groups fontSize="medium" style={{marginLeft: "5px", paddingTop: "7px"}}/>
      </a>
      <a className="menu-item" href="/duels">
        Duels
        <SportsKabaddi fontSize="medium" style={{marginLeft: "5px", paddingTop: "7px"}}/>
      </a>

      <a className="menu-item" href="/pickled">
        Pickled List
        <ThumbDown fontSize="medium" style={{marginLeft: "5px", paddingTop: "7px"}}/>
      </a>

      <div className='padding'/>

      <div className='horizontal-bar'/>

      <div className='padding'/>

      {props.user?<label style={{fontSize: "20px", color: "white"}}>{props.user.name}</label>:""}


      {props.isLoggedIn?
      <a className="menu-item" href="/profile">
        My Profile
      </a>
      :""}
      {props.isLoggedIn?
      <a className="menu-item" href="/login" onClick={handleLogout}>
        Log Out
      </a>
      :""}

    {!props.isLoggedIn?
      <a className="menu-item" href="/login">
      Log in
    </a>
    :""}
    {!props.isLoggedIn?
    <a className="menu-item" href="/register">
      Sign up
    </a>
    :""}

    </Menu>
  );
  


};