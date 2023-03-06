import Navbar from "../components/Navbar";
import { getSession } from "next-auth/react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Head from "next/head";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import DialogTitle from "@mui/material/DialogTitle";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import {
  setDriverLocation,
  deleteDriverLocation,
} from "../services/blockchain";
import {
  retrieveDriverInformation,
  setDriverInformation,
} from "../services/blockchain";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";

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

const mapOptions = {
  styles: [
    {
      elementType: "geometry",
      stylers: [
        {
          color: "#ebe3cd",
        },
      ],
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#523735",
        },
      ],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#f5f1e6",
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#c9b2a6",
        },
      ],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#dcd2be",
        },
      ],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#ae9e90",
        },
      ],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [
        {
          color: "#dfd2ae",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          color: "#dfd2ae",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#93817c",
        },
      ],
    },
    {
      featureType: "poi.business",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#a5b076",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#447530",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          color: "#f5f1e6",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [
        {
          color: "#fdfcf8",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          color: "#f8c967",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#e9bc62",
        },
      ],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry",
      stylers: [
        {
          color: "#e98d58",
        },
      ],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#db8555",
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#806b63",
        },
      ],
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [
        {
          color: "#dfd2ae",
        },
      ],
    },
    {
      featureType: "transit.line",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#8f7d77",
        },
      ],
    },
    {
      featureType: "transit.line",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#ebe3cd",
        },
      ],
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [
        {
          color: "#dfd2ae",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#b9d3c2",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#92998d",
        },
      ],
    },
  ],
};

function Driver() {
  let addr = "0x9e003FaBD5221e4d7Bb09B068D73F8F94015b4bb";
  let pick = "Thrissur";
  let drop = "Fort Kochi";

  const [currentPlace, setCurrentPlace] = useState("");
  const [currentLatLng, setCurrentLatLng] = useState(null);
  const [center, setCenter] = useState({ lat: 9.9312, lng: 76.2499 });
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [aadharNumber, setAadharNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [license, setLicense] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [rcbook, setRcBook] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [bottomSheet, setBottomSheet] = useState(false);
  const icon = {
    url: "/mapicon.png",
    scaledSize: { width: 60, height: 60 },
  };

  const DeleteLocation = async (event) => {
    await deleteDriverLocation();
    setCurrentLatLng(null);
  };

  const MarkerUpdate = () => {
    if (navigator.geolocation) {
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

  const ShowMarker = () => {
    if (navigator.geolocation) {
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
    if (window.ethereum.selectedAddress === null) {
      setAlertOpen(true);
    } else retrieve();

    async function retrieve() {
      let details = await retrieveDriverInformation();
      if (details[2]) ShowMarker();
      if (!details[0]) setOpen(true);
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
      <Dialog
        style={{ marginTop: "45px" }}
        open={open}
        onClose={async () => {
          if (name && phone && license) {
            setOpen(false);
            await setDriverInformation({
              name,
              phone,
              model: type,
              vehicleNumber,
              rcBook: rcbook,
              license,
              vehicleName,
              aadhar: aadharNumber,
            });
          }
        }}
      >
        <DialogTitle
          style={{
            fontFamily: "Josefin Sans",
            fontWeight: "700",
            fontSize: "30px",
            textAlign: "center",
          }}
        >
          Driver Details
        </DialogTitle>
        <Divider />
        <DialogContent>
          <TextField
            id="outlined-basic"
            label="Driver's Name"
            variant="outlined"
            style={{
              width: "250px",
              margin: "10px",
              marginLeft: "13.5px",
            }}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <TextField
            id="outlined-basic"
            label="Driver's Phone"
            variant="outlined"
            style={{
              width: "250px",
              margin: "10px",
              marginLeft: "13.5px",
            }}
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
            }}
          />
          <TextField
            id="outlined-basic"
            label="Aadhar Number"
            variant="outlined"
            style={{
              width: "250px",
              margin: "10px",
              marginLeft: "13.5px",
            }}
            value={aadharNumber}
            onChange={(event) => {
              setAadharNumber(event.target.value);
            }}
          />

          <TextField
            id="outlined-basic"
            label="Vehicle Number"
            variant="outlined"
            style={{
              width: "250px",
              margin: "10px",
              marginLeft: "13.5px",
            }}
            value={vehicleNumber}
            onChange={(event) => {
              setVehicleNumber(event.target.value);
            }}
          />
          <TextField
            id="outlined-basic"
            label="Vehicle Model"
            variant="outlined"
            style={{
              width: "250px",
              margin: "10px",
              marginLeft: "13.5px",
            }}
            value={vehicleName}
            onChange={(event) => {
              setVehicleName(event.target.value);
            }}
          />
          <TextField
            id="outlined-basic"
            label="RC Number"
            variant="outlined"
            style={{
              width: "250px",
              margin: "10px",
              marginLeft: "13.5px",
            }}
            value={rcbook}
            onChange={(event) => {
              setRcBook(event.target.value);
            }}
          />
          <Box>
            <FormControl
              style={{
                width: "250px",
                margin: "10px",
                marginLeft: "13.5px",
              }}
            >
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                label="Age"
                onChange={(event) => {
                  setType(event.target.value);
                }}
              >
                <MenuItem value={"Classic"}>Classic</MenuItem>
                <MenuItem value={"Premium"}>Premium</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TextField
            id="outlined-basic"
            label="Driving License"
            variant="outlined"
            style={{
              width: "250px",
              margin: "10px",
              marginLeft: "13.5px",
            }}
            value={license}
            onChange={(event) => {
              setLicense(event.target.value);
            }}
          />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            variant="contained"
            size="large"
            onClick={async () => {
              if (name && phone && license) {
                setOpen(false);
                await setDriverInformation({
                  name,
                  phone,
                  model: type,
                  vehicleNumber,
                  rcBook: rcbook,
                  license,
                  vehicleName,
                  aadhar: aadharNumber,
                });
              }
            }}
            style={{
              fontFamily: "Josefin Sans",
              marginTop: "30px",
              position: "relative",
              right: "18px",
              paddingTop: "14px",
              bottom: "15px",
              width: "120px",
              borderRadius: "10px",
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <div id="mapbox">
        <LoadScript
          googleMapsApiKey={GOOGLE_MAPS_API_KEY}
          libraries={LIBRARIES}
        >
          <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              styles: mapOptions.styles,
            }}
          >
            {currentLatLng && <Marker position={currentLatLng} icon={icon} />}
          </GoogleMap>
        </LoadScript>
      </div>
      <Head>
        <title>DriveGo | Location</title>
      </Head>
      <Navbar />
      <section className="location">
        <h1 style={{ textAlign: "center" }}>Location</h1>
        <p style={{ fontSize: "22px" }}>Update :</p>
        <Button
          variant="contained"
          sx={{ background: "#000", color: "white" }}
          className="switch"
          onClick={MarkerUpdate}
        >
          Location
        </Button>
        <p style={{ fontSize: "22px", position: "relative", bottom: "50px" }}>
          Location :
        </p>
        <Button
          variant="contained"
          sx={{ background: "#000", color: "white" }}
          className="update"
          onClick={DeleteLocation}
        >
          Delete
        </Button>
        <h1
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
          <CheckCircleOutlinedIcon className="tick" fontSize="large" />
          <CancelOutlinedIcon className="cross" fontSize="large" />
        </div>
        <div className="request" style={{ fontSize: "16px" }}>
          <p style={{ paddingTop: "9px" }}>
            From : {addr.slice(0, 5)}....{addr.slice(37)}
          </p>
          <p style={{ marginTop: "-10px" }}>Pickup : {pick}</p>
          <p style={{ marginTop: "-10px" }}>Dropoff : {drop}</p>
          <CheckCircleOutlinedIcon className="tick" fontSize="large" />
          <CancelOutlinedIcon className="cross" fontSize="large" />
        </div>
      </section>
      <button onClick={() => setBottomSheet(true)}>Open bottom sheet</button>
      <BottomSheet
        style={{ color: "black" }}
        open={bottomSheet}
        onDismiss={() => {
          setBottomSheet(false);
        }}
      >
        <h1 style={{ margin: "20px" }}>Ongoing Rides</h1>
      </BottomSheet>
    </div>
  );
}

export default Driver;
