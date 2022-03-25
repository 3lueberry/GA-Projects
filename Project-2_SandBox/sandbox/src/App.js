import React, { useState, useEffect } from "react";
import { createGlobalStyle } from "styled-components";
import { Routes, Route, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import Home from "./pages/Home";
import Chats from "./pages/Chats";
import Message from "./pages/Message";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const GlobalStyle = createGlobalStyle`
:root, body {
    height:${({ height }) => height}px;
    width:${({ width }) => width}px;
}`;

function App() {
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <GlobalStyle height={dimensions.height} width={dimensions.width} />
      <main style={{ width: "100%", height: "100%" }}>
        <Container
          className="d-flex flex-column justify-content-center align-content-center"
          style={{ height: "100%" }}
        >
          <Routes>
            <Route path="/*" element={<Navigate replace to="/" />} />
            <Route path="/" element={<Home />} />
            <Route path="/:user" element={<Chats />} />
            <Route path="/:user/:room" element={<Message />} />
          </Routes>
        </Container>
      </main>
    </>
  );
}

export default App;
