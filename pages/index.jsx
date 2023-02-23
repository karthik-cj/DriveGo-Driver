import Navbar from "../components/Navbar";
import { getSession } from "next-auth/react";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Head from "next/head";
// import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
// import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import {
  setDriverLocation,
  deleteDriverLocation,
} from "../services/blockchain";

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

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const LIBRARIES = ["places"];

function Driver() {
  // let addr = "0x9e003FaBD5221e4d7Bb09B068D73F8F94015b4bb";
  // let pick = "Thrissur";
  // let drop = "Fort Kochi";

  const [currentPlace, setCurrentPlace] = useState("");
  const [toggle, setToggle] = useState(false);
  const [currentLatLng, setCurrentLatLng] = useState(null);
  const [center, setCenter] = useState({ lat: 9.9312, lng: 76.2673 });

  const MarkerToggle = async (event) => {
    if (event.target.checked) {
      setToggle(true);
    } else {
      await deleteDriverLocation();
      setToggle(false);
      setCurrentPlace("");
      setCurrentLatLng(null);
    }
  };

  const MarkerUpdate = () => {
    if (navigator.geolocation && toggle) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const geocoder = new window.google.maps.Geocoder();
          const latLng = new window.google.maps.LatLng(latitude, longitude);
          geocoder.geocode({ location: latLng }, async (results, status) => {
            if (status === "OK") {
              if (results[0]) {
                setCurrentPlace(results[0].formatted_address);
                setCurrentLatLng({ lat: latitude, lng: longitude });
                setCenter({ lat: latitude, lng: longitude });
                await setDriverLocation({
                  location: results[0].formatted_address,
                });
              } else {
                console.log("No results found");
              }
            } else {
              console.log(`Geocoder failed due to: ${status}`);
            }
          });
        },
        () => {
          console.log("Unable to retrieve location.");
        }
      );
    } else {
      console.log("Geolocation not supported by browser.");
    }
  };

  useEffect(() => {
    MarkerUpdate();
  }, [toggle]);

  return (
    <div>
      <div id="mapbox">
        <LoadScript
          googleMapsApiKey={GOOGLE_MAPS_API_KEY}
          libraries={LIBRARIES}
        >
          <GoogleMap
            center={center}
            zoom={13}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {currentLatLng && <Marker position={currentLatLng} />}
          </GoogleMap>
        </LoadScript>
      </div>
      <Head>
        <title>DriveGo | Location</title>
      </Head>
      <Navbar />
      <section className="location">
        <h1 style={{ textAlign: "center" }}>Location</h1>
        <p style={{ fontSize: "22px" }}>Disable/Enable :</p>
        <Switch className="switch" onChange={MarkerToggle} />
        <p style={{ fontSize: "22px", position: "relative", bottom: "60px" }}>
          Location :
        </p>
        <Button variant="contained" className="update" onClick={MarkerUpdate}>
          Update
        </Button>
        {/* <h1
          style={{ textAlign: "center", position: "relative", bottom: "105px" }}
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
        </div> */}
      </section>
    </div>
  );
}

export default Driver;
