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
      <div className="login-box">
        <h2>Driver</h2>
        <h2 style={{ marginTop: "-20px" }}>Authentication</h2>
        <form style={{ position: "relative", left: "95px", bottom: "30px" }}>
          <a onClick={handleRider}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Sign In
          </a>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
