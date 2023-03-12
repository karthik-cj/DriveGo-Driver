import { useState } from "react";

const Navbar = () => {
  return (
    <nav id="navbar">
      <a className="navlogo">DriveGo</a>
      <div className="navlinks-container">
        <a href="/myTrips" className="navlink">
          My Trips
        </a>
        <a href="/wallet" className="navlink">
          Wallet
        </a>
        <a href="/profile" className="navlink">
          Profile
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
