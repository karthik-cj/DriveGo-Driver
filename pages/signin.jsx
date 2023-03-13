import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { signIn } from "next-auth/react";
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthRequestChallengeEvm } from "@moralisweb3/next";
import isOnline from "is-online";
import Head from "next/head";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function SignIn() {
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { requestChallengeAsync } = useAuthRequestChallengeEvm();
  const { push } = useRouter();
  const [connectInternet, setConnectInternet] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const handleRider = async () => {
    if (!(await isOnline())) {
      setConnectInternet(true);
    } else {
      if (isConnected) {
        await disconnectAsync();
      }

      try {
        const { account, chain } = await connectAsync({
          connector: new MetaMaskConnector(),
        });

        const { message } = await requestChallengeAsync({
          address: account,
          chainId: chain.id,
        });

        const signature = await signMessageAsync({ message });
        const { url } = await signIn("moralis-auth", {
          message,
          signature,
          redirect: false,
          callbackUrl: "/",
        });
        push(url);
      } catch (error) {
        setAlertOpen(true);
      }
    }
  };

  return (
    <div className="loginBaground">
      <Snackbar
        open={connectInternet}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="error"
          sx={{ width: "100%", fontWeight: "bold", fontFamily: "Josefin Sans" }}
          onClose={() => {
            setConnectInternet(false);
          }}
        >
          Connect To Internet !!!
        </Alert>
      </Snackbar>
      <Snackbar
        open={alertOpen}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="error"
          sx={{ width: "100%", fontWeight: "bold", fontFamily: "Josefin Sans" }}
          onClose={() => {
            setAlertOpen(false);
          }}
        >
          User Rejects Request !!!
        </Alert>
      </Snackbar>
      <Head>
        <title>DriveGo | Authenticate</title>
      </Head>
      <div>
        <img className="wave" src="/wave.png" />
        <div className="container">
          <div className="img">
            <img src="/bg.svg" />
          </div>
          <div className="login-content">
            <img style={{ marginBottom: "10px" }} src="/avatar.svg" />
            <h2>Driver</h2>
            <input
              type="button"
              className="btn"
              onClick={handleRider}
              value="Login"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
