import { getSession, signOut } from "next-auth/react";
import Navbar from "../components/Navbar";
import ProfileElement from "../components/ProfileElement";
import Head from "next/head";
// import { useEffect, useState } from "react";
// import { retrieveUserInformation } from "../services/blockchain";
import { CircularProgress } from "@mui/material";

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
  let userInfo = "abc";
  // const [userInfo, setUserInfo] = useState(null);

  // useEffect(() => {
  //   getInfo();
  //   async function getInfo() {
  //     setUserInfo(await retrieveUserInformation());
  //   }
  // }, []);

  return (
    <div>
      <Head>
        <title>DriveGo | Profile</title>
      </Head>
      <Navbar />
      <ProfileElement />
      <div id="profile">
        {userInfo === null ? (
          <CircularProgress className="profileProgress" />
        ) : (
          <div>
            <div className="image">
              <img src="/login.png" width={45} />
            </div>
            {/* <h1 className="profile_name">{userInfo[0]}</h1>
            <h3 className="profile_no">+91 {parseInt(userInfo[1]._hex, 16)}</h3> */}
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
              onClick={() => signOut({ redirect: "/signin" })}
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