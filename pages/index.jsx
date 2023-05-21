import Navbar from "../components/Navbar";
import { getSession, signOut } from "next-auth/react";
import Button from "@mui/material/Button";
import { Rating } from "@mui/material";
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
  retrieveDriverInformation,
  setDriverInformation,
  getData,
  rejectRide,
  acceptRide,
  updateUserRating,
} from "../services/blockchain";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import axios from "axios";

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
          color: "#f5f5f5",
        },
      ],
    },
    {
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#616161",
        },
      ],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#f5f5f5",
        },
      ],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#bdbdbd",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          color: "#eeeeee",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#757575",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        {
          color: "#e5e5e5",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#9e9e9e",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#757575",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          color: "#dadada",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#616161",
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#9e9e9e",
        },
      ],
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [
        {
          color: "#e5e5e5",
        },
      ],
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [
        {
          color: "#eeeeee",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#c9c9c9",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#9e9e9e",
        },
      ],
    },
  ],
};

function Driver({ user }) {
  const [value, setValue] = useState(2);
  const [accept, setAccept] = useState(null);
  const [data, setData] = useState([]);
  const [currentLatLng, setCurrentLatLng] = useState(null);
  const [center, setCenter] = useState({ lat: 9.9312, lng: 76.2499 });
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [license, setLicense] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [bottomSheet, setBottomSheet] = useState(false);
  const [connectInternet, setConnectInternet] = useState(false);
  const [connectInternet1, setConnectInternet1] = useState(false);
  const icon = {
    url: "/mapicon.png",
    scaledSize: { width: 45, height: 45 },
  };

  const DeleteLocation = async () => {
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

  const ShowMarker = (specificLocation) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: specificLocation }, async (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          const { lat, lng } = results[0].geometry.location;
          setCurrentLatLng({ lat: lat(), lng: lng() });
          setCenter({ lat: lat(), lng: lng() });
        } else {
          console.log("No results found");
        }
      } else {
        console.log(`Geocoder failed due to: ${status}`);
      }
    });
  };

  useEffect(() => {
    async function retrieve() {
      let details = await retrieveDriverInformation();
      if (details) {
        if (details[2]) ShowMarker(details[2]);
        if (!details[0]) setOpen(true);
      }
    }

    window.ethereum.on("accountsChanged", function (accounts) {
      if (accounts.length > 0) {
        retrieve();
      } else {
        signOut({ redirect: "/signin" });
      }
    });

    if (window.ethereum.selectedAddress !== null) {
      retrieve();
    } else {
      signOut({ redirect: "/signin" });
    }
  }, []);

  useEffect(() => {
    if (window.ethereum.selectedAddress !== null) {
      const interval = setInterval(async () => {
        let count = 0;
        const data = await getData();
        console.log(data);
        setData(data);

        if (data?.length === 0) setAccept(null);
        for (let i = 0; i < data.length; i++) {
          if (
            data[i].accept &&
            data[i].driverAddress.toLowerCase() ===
              window.ethereum.selectedAddress.toLowerCase()
          ) {
            count++;
            setAccept(data[i]);
            break;
          }
        }
        if (count === 0) setAccept(null);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (accept === null) setBottomSheet(false);
    else setBottomSheet(true);
  }, [accept]);

  async function AadharValidation() {
    const encodedParams = new URLSearchParams();
    encodedParams.set("captchaValue", "TK6HXq");
    encodedParams.set("captchaTxnId", "58p5MxkQrNFp");
    encodedParams.set("method", "uidvalidate");
    encodedParams.set("clientid", "111");
    encodedParams.set("txn_id", "4545533");
    encodedParams.set("consent", "Y");
    encodedParams.set("uidnumber", aadharNumber);

    const options = {
      method: "POST",
      url: "https://aadhaar-number-verification.p.rapidapi.com/Uidverifywebsvcv1/Uidverify",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "8fe67656dcmsh04eb6781511e373p1850ecjsn834287a91eb1",
        "X-RapidAPI-Host": "aadhaar-number-verification.p.rapidapi.com",
      },
      data: encodedParams,
    };

    const detail = {
      method: "POST",
      url: "https://driving-license-verification1.p.rapidapi.com/DL/DLDetails",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "8fe67656dcmsh04eb6781511e373p1850ecjsn834287a91eb1",
        "X-RapidAPI-Host": "driving-license-verification1.p.rapidapi.com",
      },
      data: {
        method: "dlvalidate",
        txn_id: "9ujh7gdhgs",
        clientid: "222",
        consent: "Y",
        dlnumber: license,
        dob: dob,
      },
    };

    try {
      const uuid = await axios.request(options);
      console.log(uuid.data);

      const driving = await axios.request(detail);
      console.log(driving.data);

      if (uuid.data.Succeeded && driving.data.Succeeded) {
        await setDriverInformation({
          name,
          phone,
          model: type,
          vehicleNumber,
          dob,
          license,
          vehicleName,
          aadhar: aadharNumber,
        });
        setOpen(false);
      } else {
        if (driving.data.Succeeded) {
          setConnectInternet(true);
        }
        if (uuid.data.Succeeded) {
          setConnectInternet1(true);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <Snackbar
        open={connectInternet}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="error"
          sx={{
            width: "100%",
            fontWeight: "bold",
            fontFamily: "Josefin Sans",
          }}
          onClose={() => {
            setConnectInternet(false);
          }}
        >
          Invalid Aadhar Number
        </Alert>
      </Snackbar>
      <Snackbar
        open={connectInternet1}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="error"
          sx={{
            width: "100%",
            fontWeight: "bold",
            fontFamily: "Josefin Sans",
          }}
          onClose={() => {
            setConnectInternet1(false);
          }}
        >
          Invalid Driving License
        </Alert>
      </Snackbar>
      <Dialog
        style={{ marginTop: "45px" }}
        open={open}
        onClose={async () => {
          if (
            name &&
            phone &&
            license &&
            dob &&
            aadharNumber &&
            vehicleNumber &&
            vehicleName &&
            type
          ) {
            await AadharValidation();
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
        <DialogContent
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
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
            label="DoB"
            variant="outlined"
            placeholder="01-01-1000"
            style={{
              width: "250px",
              margin: "10px",
              marginLeft: "13.5px",
            }}
            value={dob}
            onChange={(event) => {
              setDob(event.target.value);
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
              if (
                name &&
                phone &&
                license &&
                dob &&
                aadharNumber &&
                vehicleNumber &&
                vehicleName &&
                type
              ) {
                await AadharValidation();
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
          sx={{
            background: "#000",
            color: "white",
            fontFamily: "Josefin Sans",
            paddingTop: "9px",
            position: "relative",
            height: "35px",
            left: "105px",
            bottom: "50px",
            borderRadius: "10px",
            boxShadow: "none",
            "&:hover": {
              background: "#ebebeb",
              boxShadow: "none",
              color: "black",
            },
          }}
          onClick={MarkerUpdate}
        >
          Location
        </Button>
        <p style={{ fontSize: "22px", position: "relative", bottom: "50px" }}>
          Location :
        </p>
        <Button
          variant="contained"
          sx={{
            background: "#000",
            color: "white",
            fontFamily: "Josefin Sans",
            paddingTop: "9px",
            position: "relative",
            height: "35px",
            left: "115px",
            bottom: "100px",
            borderRadius: "10px",
            boxShadow: "none",
            "&:hover": {
              background: "#ebebeb",
              boxShadow: "none",
              color: "black",
            },
          }}
          onClick={DeleteLocation}
        >
          Delete
        </Button>
        <h1
          style={{ textAlign: "center", position: "relative", bottom: "105px" }}
        >
          Requests
        </h1>
        <div className="request_body">
          {data?.map((data, index) => {
            const addr = data.driverAddress === user.address;
            const accept = data.accept === false;
            if (addr && accept) {
              return (
                <div
                  key={index}
                  className="request"
                  style={{ fontSize: "16px" }}
                >
                  <p style={{ paddingTop: "9px" }}>
                    From: {data.userAddress.slice(0, 7)}......
                    {data.userAddress.slice(35)}
                  </p>
                  <p style={{ marginTop: "-10px" }}>
                    Pickup: {data.pickup.slice(0, -7)}
                  </p>
                  <p style={{ marginTop: "-10px" }}>
                    Dropoff: {data.dropoff.slice(0, -7)}
                  </p>
                  <CheckCircleOutlinedIcon
                    className="tick"
                    fontSize="large"
                    onClick={async () => {
                      await acceptRide({
                        userAddr: data.userAddress,
                        driverAddr: data.driverAddress,
                      });
                    }}
                    sx={{
                      "&:hover": {
                        color: "green",
                      },
                    }}
                  />
                  <CancelOutlinedIcon
                    className="cross"
                    fontSize="large"
                    onClick={async () => {
                      await rejectRide({
                        userAddr: data.userAddress,
                        driverAddr: data.driverAddress,
                      });
                    }}
                    sx={{
                      "&:hover": {
                        color: "#DF2E38",
                      },
                    }}
                  />
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </section>
      <BottomSheet style={{ color: "black" }} open={bottomSheet}>
        <div style={{ margin: "20px" }}>
          <h1>Ongoing Rides</h1>
          {accept !== null ? (
            <div
              style={{
                borderRadius: "10px",
                background: "#efefee",
                padding: "5px",
                paddingLeft: "10px",
                fontWeight: "bold",
              }}
            >
              <p style={{ margin: "7px" }}>
                Rider : {accept.userAddress.slice(0, 7)}......
                {accept.userAddress.slice(35)}
              </p>
              <p style={{ margin: "7px" }}>
                PickUp : {accept.pickup.slice(0, -7)}
              </p>
              <p style={{ margin: "7px" }}>
                DropOff : {accept.dropoff.slice(0, -7)}
              </p>
              <p style={{ margin: "7px" }}>Amount : {accept.amount} MATIC</p>
              <p style={{ margin: "7px" }}>Rate Rider : </p>
              <Rating
                name="simple-controlled"
                value={value}
                onChange={async (event, newValue) => {
                  setValue(newValue);
                  await updateUserRating({
                    userAddr: accept.userAddress,
                    rating: newValue,
                  });
                }}
                size="small"
                sx={{ position: "absolute", left: "128px", bottom: "33px" }}
              />
            </div>
          ) : null}
        </div>
      </BottomSheet>
    </div>
  );
}

export default Driver;
