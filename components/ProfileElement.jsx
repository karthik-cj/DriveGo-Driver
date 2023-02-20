import { useRouter } from "next/router";

const ProfileElement = () => {
  const router = useRouter();
  return (
    <div className="profile_element">
      <a href="/">
        <div className={router.pathname == "/" ? "active" : ""}>
          <h3>Location</h3>
        </div>
      </a>
      <a href="/myTrips">
        <div className={router.pathname == "/myTrips" ? "active" : ""}>
          <h3>My Trips</h3>
        </div>
      </a>
      <a href="/wallet">
        <div className={router.pathname == "/wallet" ? "active" : ""}>
          <h3>Wallet</h3>
        </div>
      </a>
      <a href="/profile">
        <div className={router.pathname == "/profile" ? "active" : ""}>
          <h3>Profile Settings</h3>
        </div>
      </a>
      <a href="/about">
        <div className={router.pathname == "/about" ? "active" : ""}>
          <h3>About</h3>
        </div>
      </a>
    </div>
  );
};

export default ProfileElement;
