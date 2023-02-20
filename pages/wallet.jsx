import Navbar from "../components/Navbar";
import ProfileElement from "../components/ProfileElement";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Card from "@mui/material/Card";
import { useState, useEffect } from "react";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";
import { CardActionArea } from "@mui/material";
import Divider from "@mui/material/Divider";

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
    "http://localhost:5000/api/moralis/balance",
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
      const transactionResult = await fetch(
        "http://localhost:5000/api/moralis/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: user.address,
          }),
        }
      );
      const Transactions = await transactionResult.json();
      setTransactions(Transactions);
      setLoading(false);
    };
    fetchData();
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
          {Math.floor(parseInt(userBal.rawValue, 16) * 1e-18 * 10000) / 10000}{" "}
          ETH
        </h1>
        <button className="addFund">
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
                sx={{ maxWidth: 360, maxHeight: 430 }}
                key={index.blockNumber}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="190"
                    image="/ethercoin.jpg"
                    alt="Ether Coin"
                  />
                  <CardContent>
                    <Typography variant="h5" className="typing">
                      Value : {Math.floor(index.value * 1e-18 * 10000) / 10000}{" "}
                      ETH
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>
                        From: {index.from}
                        <Divider className="divider" />
                        To: {index.to}
                        <Divider className="divider" />
                        Date/Time: {index.blockTimestamp}
                      </b>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

export default Wallet;
