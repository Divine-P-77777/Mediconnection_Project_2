"use client";

import React from "react";
import { useSelector } from "react-redux";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";


export default function NotFoundPage() {
  // TODO: Replace 'any' with RootState from store
  const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);

  const pageStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? "#1e3a8a" : "#0F2137",
    color: isDarkMode ? "#ffffff" : "#000000",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "2rem",
  };

  const titleStyle = {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  };

  const subtitleStyle = {
    fontSize: "1.2rem",
    marginBottom: "2rem",
  };

  return (
    <div style={pageStyle}>
      <DotLottieReact
        src="https://lottie.host/9f915de4-3c20-4f7f-a7aa-7a661fbe80cc/NTcHyS1mJq.lottie"
        loop
        autoplay
        style={{ width: "300px", marginBottom: "2rem" }}
      />
      <h1 style={titleStyle}>404 - Page Not Found</h1>
      <p style={subtitleStyle}>
        Oops! The page you are looking for doesn’t exist on Mediconnection.
      </p>
      <a
        href="/"
        style={{
          padding: "0.8rem 1.5rem",
          backgroundColor: isDarkMode ? "#2563eb" : "#00acc1",
          color: "#ffffff",
          borderRadius: "0.5rem",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Go Back Home
      </a>
    </div>
  );
}
