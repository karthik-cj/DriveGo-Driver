import Navbar from "../components/Navbar";
import ProfileElement from "../components/ProfileElement";
import { getSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Head from "next/head";
import { displayRideHistory } from "../services/blockchain";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

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

const Trips = ({ user }) => {
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
  const [trips, setTrips] = useState(null);

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
    async function getHistory() {
      let data = await displayRideHistory();
      console.log(data);
      setTrips(data);
    }
    getHistory();
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

      <div id="tripBox">
        {trips !== null ? (
          <div>
            {trips.map((trip, index) => {
              if (trip.driverAddress === user.address) {
                return (
                  <Card
                    sx={{
                      minWidth: 360,
                      maxWidth: 360,
                      maxHeight: 430,
                      fontFamily: "Josefin Sans",
                      paddingBottom: "0px",
                      paddingLeft: "20px",
                      marginBottom: "35px",
                      fontWeight: "bold",
                      background: "#ECF2FF",
                      boxShadow: "none",
                      borderRadius: "20px",
                    }}
                    key={index}
                  >
                    <CardContent>
                      <p>
                        Rider : {trip.userAddress.slice(0, 7)}......
                        {trip.userAddress.slice(35)}
                      </p>
                      <p>Pickup : {trip.pickup}</p>
                      <p>DropOff : {trip.dropoff}</p>
                      <p>Amount : {trip.amount} ETH</p>
                      <p>
                        Date :{" "}
                        {new Date(
                          parseInt(trip.date._hex, 16) * 1000
                        ).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                );
              }
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Trips;
