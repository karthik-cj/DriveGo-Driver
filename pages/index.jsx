import Navbar from "../components/Navbar";
import { getSession } from "next-auth/react";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Head from "next/head";

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
      </section>
    </div>
  );
}

export default Rider;
