import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { signIn } from "next-auth/react";
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import { useAuthRequestChallengeEvm } from "@moralisweb3/next";
import isOnline from "is-online";
import Head from "next/head";
import { useState } from "react";
// import { setUserInformation } from "../services/blockchain";

function SignIn() {
  const [inputName, setinputName] = useState("");
  const [inputPhone, setinputPhone] = useState("");

  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { requestChallengeAsync } = useAuthRequestChallengeEvm();
  const { push } = useRouter();

  const handleAuth = async () => {
    await handleRider();
    // setTimeout(async function () {
    //   await setUserInformation({ name: inputName, phone: inputPhone });
    // }, 1000);
  };

  const handleRider = async () => {
    if (!(await isOnline())) {
      alert("Connect To Internet");
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
        alert("User rejected request");
      }
    }
  };

  return (
    <div className="loginBaground">
      <Head>
        <title>DriveGo | Authenticate</title>
      </Head>
      <div className="login-box">
        <h2>Driver</h2>
        <h2 style={{ marginTop: "-20px" }}>Authentication</h2>
        <form>
          <div className="user-box">
            <input
              type="text"
              placeholder="Username"
              value={inputName}
              onChange={(e) => setinputName(e.target.value)}
            />
          </div>
          <div className="user-box">
            <input
              type="text"
              placeholder="Phone Number"
              value={inputPhone}
              onChange={(e) => setinputPhone(e.target.value)}
            />
          </div>
          <a onClick={handleAuth}>
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
