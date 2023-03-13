import Navbar from "../components/Navbar";
import ProfileElement from "../components/ProfileElement";
import { getSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
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

const Trips = () => {
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var month = new Date().getMonth();
  var thisMonth = months[month];
  var prevMonth = months[month - 1];
  const [activeTab, setActiveTab] = useState("tab1");

  const handleTab1 = () => {
    setActiveTab("tab1");
  };
  const handleTab2 = () => {
    setActiveTab("tab2");
  };
  const handleTab3 = () => {
    setActiveTab("tab3");
  };

  useEffect(() => {
    window.ethereum.on("accountsChanged", function (accounts) {
      if (accounts.length === 0) {
        signOut({ redirect: "/signin" });
      }
    });
  }, []);

  return (
    <div>
      <Head>
        <title>DriveGo | My Trips</title>
      </Head>
      <Navbar />
      <ProfileElement />
      <h1 className="tripHeading">My Trips</h1>
      <div className="monthBox">
        <div
          className="select_month"
          onClick={handleTab1}
          id={activeTab === "tab1" ? "active" : ""}
          style={{ left: "410px" }}
        >
          <p>All Trips</p>
        </div>
        <div
          className="select_month"
          onClick={handleTab2}
          id={activeTab === "tab2" ? "active" : ""}
          style={{ left: "517px" }}
        >
          <p>{thisMonth}</p>
        </div>
        <div
          className="select_month"
          onClick={handleTab3}
          id={activeTab === "tab3" ? "active" : ""}
          style={{ left: "625px" }}
        >
          <p>{prevMonth}</p>
        </div>
      </div>

      <div id="tripBox"></div>
    </div>
  );
};

export default Trips;
