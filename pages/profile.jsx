import { getSession, signOut } from "next-auth/react";
import Navbar from "../components/Navbar";
import ProfileElement from "../components/ProfileElement";
import Head from "next/head";
import { useEffect, useState } from "react";
import { retrieveDriverInformation } from "../services/blockchain";
import { CircularProgress } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
  return {
    props: { user: session.user },
  };
}

const Profile = ({ user }) => {
  const [driverInfo, setDriverInfo] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    if (window.ethereum.selectedAddress === null) {
      setAlertOpen(true);
    } else getInfo();
    async function getInfo() {
      setDriverInfo(await retrieveDriverInformation());
    }
  }, []);

  return (
    <div>
      <Snackbar
        open={alertOpen}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        style={{ marginTop: "40px" }}
      >
        <Alert
          severity="error"
          sx={{ width: "100%", fontWeight: "bold", fontFamily: "Josefin Sans" }}
          onClose={() => {
            setAlertOpen(false);
          }}
        >
          Connect To Metamask Wallet !!!
        </Alert>
      </Snackbar>
      <Head>
        <title>DriveGo | Profile</title>
      </Head>
      <Navbar />
      <ProfileElement />
      <div id="profile">
        {driverInfo === null ? (
          <CircularProgress className="profileProgress" />
        ) : (
          <div>
            <div className="image">
              <img src="/login.png" width={45} />
            </div>
            <h1 className="profile_name">{driverInfo[0]}</h1>
            <h3 className="profile_no">+91 {driverInfo[1]}</h3>
            <br />
            <br />
            <label>Identification</label>
            <p>{user.id}</p>
            <label>Address</label>
            <p>{user.address}</p>
            <label>Domain</label>
            <p>{user.domain}</p>
            <label>Chain Id</label>
            <p>{user.chainId}</p>
            <label>Nonce</label>
            <p>{user.nonce}</p>
            <button
              className="logout"
              onClick={() => {
                signOut({ redirect: "/signin" });
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
