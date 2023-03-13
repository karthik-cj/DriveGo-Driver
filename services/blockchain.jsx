import abi from "../constants/UserDetails.json";
import address from "../constants/contractAddress.json";
import { ethers } from "ethers";

let ethereum;
let contractAddress;
let contractAbi;

if (typeof window !== "undefined") {
  ethereum = window.ethereum;
  contractAddress = address.address;
  contractAbi = abi.abi;
}

const getEtheriumContract = async () => {
  if (!ethereum) return alert("No Wallet Found");
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractAbi, signer);
  return contract;
};

const setDriverInformation = async ({
  name,
  phone,
  model,
  vehicleNumber,
  rcBook,
  license,
  vehicleName,
  aadhar,
}) => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    await contract.setDriverInformation(
      name,
      phone,
      model,
      vehicleNumber,
      rcBook,
      license,
      vehicleName,
      aadhar
    );
  } catch (error) {
    reportError(error);
  }
};

const retrieveDriverInformation = async () => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    const data = await contract.retrieveDriverInformation();
    return data;
  } catch (error) {
    reportError(error);
  }
};

const setDriverLocation = async ({ location }) => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    await contract.setDriverLocation(location);
  } catch (error) {
    reportError(error);
  }
};

const deleteDriverLocation = async () => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    await contract.deleteDriverLocation();
  } catch (error) {
    reportError(error);
  }
};

const getData = async () => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    const data = await contract.getData();
    return data;
  } catch (error) {
    reportError(error);
  }
};

const acceptRide = async ({ userAddr, driverAddr }) => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    await contract.acceptRide(userAddr, driverAddr);
  } catch (error) {
    reportError(error);
  }
};

const rejectRide = async ({ userAddr, driverAddr }) => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    await contract.rejectRide(userAddr, driverAddr);
  } catch (error) {
    reportError(error);
  }
};

const updateUserRating = async ({ userAddr, rating }) => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    await contract.updateUserRating(userAddr, rating);
  } catch (error) {
    reportError(error);
  }
};

const displayRideHistory = async () => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    const data = await contract.displayRideHistory();
    return data;
  } catch (error) {
    reportError(error);
  }
};

const reportError = (error) => {
  console.error(error.message);
};

export {
  setDriverInformation,
  retrieveDriverInformation,
  setDriverLocation,
  deleteDriverLocation,
  getData,
  acceptRide,
  rejectRide,
  updateUserRating,
  displayRideHistory,
};
