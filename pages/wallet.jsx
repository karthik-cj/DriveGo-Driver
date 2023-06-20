import Navbar from "../components/Navbar";
import ProfileElement from "../components/ProfileElement";
import { getSession, signOut } from "next-auth/react";
import Head from "next/head";
import Card from "@mui/material/Card";
import { useState, useEffect } from "react";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";
import { Divider } from "@mui/material";

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
  const balanceResult = await fetch(
    `${process.env.NEXTAUTH_URL}/api/moralis/balance`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: session.user.address,
      }),
    }
  );
  const Balance = await balanceResult.json();
  return {
    props: { userBal: Balance.balance, user: session.user },
  };
}

const Wallet = ({ userBal, user }) => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const transactionResult = await fetch(`/api/moralis/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: user.address,
        }),
      });
      const Transactions = await transactionResult.json();
      setTransactions(Transactions);
      setLoading(false);
    };
    fetchData();
  }, []);

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
        <title>DriveGo | Wallet</title>
      </Head>
      <Navbar />
      <ProfileElement />
      <div id="wallet">
        <h3 style={{ fontWeight: "lighter", color: "#606060" }}>Balance</h3>
        <h1 style={{ marginTop: "-8px" }}>
          {(userBal / 1e18).toFixed(2)} MATIC
        </h1>
        <button
          className="addFund"
          onClick={() => window.open("https://mumbaifaucet.com/")}
        >
          <span>&#43;</span> Add Fund
        </button>
      </div>
      <h1 className="walletHeading">Transactions</h1>
      {loading ? (
        <CircularProgress className="progress" />
      ) : (
        <div id="transactions">
          {transactions.map((index) => {
            return index.value * 1e-18 > 0 ? (
              <Card
                sx={{
                  minWidth: 340,
                  maxWidth: 360,
                  maxHeight: 430,
                  fontFamily: "Josefin Sans",
                  paddingBottom: "0px",
                  marginBottom: "35px",
                  fontWeight: "bold",
                  background: "#ECF2FF",
                  boxShadow: "none",
                  borderRadius: "20px",
                }}
                key={index.blockNumber}
              >
                <CardMedia
                  component="img"
                  height="190"
                  image="/ethercoin.jpg"
                  alt="Ether Coin"
                />
                <CardContent>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", marginBottom: "10px" }}
                  >
                    Value : {Math.floor(index.value * 1e-18 * 10000) / 10000}{" "}
                    MATIC
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <b>
                      From : {index.from.slice(0, 7)}......
                      {index.from.slice(35)}
                      <Divider sx={{ margin: "10px" }} />
                      To : {index.to.slice(0, 7)}......
                      {index.to.slice(35)}
                      <Divider sx={{ margin: "10px" }} />
                      Date : {index.blockTimestamp.slice(0, -31)}
                    </b>
                  </Typography>
                </CardContent>
              </Card>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

export default Wallet;
