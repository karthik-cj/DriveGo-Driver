const Navbar = () => {
  return (
    <nav id="navbar">
      <a className="navlogo">DriveGo</a>
      <div style={{ width: "50%" }}></div>
      <a href="/myTrips" className="navlink">
        My Trips
      </a>
      <a href="/wallet" className="navlink">
        Wallet
      </a>
      <a href="/profile" style={{ marginRight: "150px" }} className="navlink">
        Profile
      </a>
    </nav>
  );
};

export default Navbar;
