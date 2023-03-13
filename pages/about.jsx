import Navbar from "../components/Navbar";
import { getSession, signOut } from "next-auth/react";
import ProfileElement from "../components/ProfileElement";
import Head from "next/head";
import { useEffect } from "react";

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

const About = () => {
  useEffect(() => {
    window.ethereum.on("accountsChanged", function (accounts) {
      if (accounts.length === 0) {
        signOut({ redirect: "/signin" });
      }
    });
  }, []);
  return (
    <div className="about">
      <Head>
        <title>DriveGo | About</title>
      </Head>
      <Navbar />
      <ProfileElement />
      <div className="inner-container">
        <h1>About Us</h1>
        <p className="text">
          DriveGo is a decentralized, peer-to-peer transportation platform built
          on blockchain technology. Our mission is to provide a more efficient,
          secure, and transparent alternative to traditional ride-hailing
          services. This means lower fees for riders, better pay for drivers,
          and a more democratic and equitable transportation ecosystem. Join us
          on our journey to revolutionize the transportation industry and help
          create a more sustainable future.
        </p>
        <div className="skills">
          <span>Web Design</span>
          <span>Photoshop & Illustrator</span>
          <span>Coding</span>
        </div>
      </div>
    </div>
  );
};

export default About;
