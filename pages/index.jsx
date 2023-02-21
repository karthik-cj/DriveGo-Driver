import Navbar from "../components/Navbar";
import { getSession } from "next-auth/react";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Head from "next/head";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

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

function Rider() {
  let addr = "0x9e003FaBD5221e4d7Bb09B068D73F8F94015b4bb";
  let pick = "Thrissur";
  let drop = "Fort Kochi";

  return (
    <div>
      <Head>
        <title>DriveGo | Location</title>
      </Head>
      <Navbar />
      <section className="location">
        <h1 style={{ textAlign: "center" }}>Location</h1>
        <p style={{ fontSize: "22px" }}>Disable/Enable :</p>
        <Switch className="switch" />
        <p style={{ fontSize: "22px", position: "relative", bottom: "60px" }}>
          Update Gps :
        </p>
        <Button variant="contained" className="update">
          Location
        </Button>
        <h1
          style={{ textAlign: "center", position: "relative", bottom: "100px" }}
        >
          Requests
        </h1>
        <div className="request" style={{ fontSize: "16px" }}>
          <p style={{ paddingTop: "9px" }}>
            From : {addr.slice(0, 5)}....{addr.slice(37)}
          </p>
          <p style={{ marginTop: "-10px" }}>Pickup : {pick}</p>
          <p style={{ marginTop: "-10px" }}>Dropoff : {drop}</p>
          <CheckCircleOutlinedIcon className="tick" />
          <CancelOutlinedIcon className="cross" />
        </div>
        <div className="request" style={{ fontSize: "16px" }}>
          <p style={{ paddingTop: "9px" }}>
            From : {addr.slice(0, 5)}....{addr.slice(37)}
          </p>
          <p style={{ marginTop: "-10px" }}>Pickup : {pick}</p>
          <p style={{ marginTop: "-10px" }}>Dropoff : {drop}</p>
          <CheckCircleOutlinedIcon className="tick" />
          <CancelOutlinedIcon className="cross" />
        </div>
      </section>
    </div>
  );
}

export default Rider;
