import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../components/store/auth";
import { loaderActions } from "../components/store/loader";
import { Row, Col } from "react-bootstrap";
import axios from "axios";
import LoadingSpinner from "../components/modals/LoadingSpinner";
import ErrorModal from "../components/modals/ErrorModal";
import Login from "../components/Login";
import styled from "styled-components";

const StyledH1 = styled.h1`
  color: rgb(79, 120, 181);
  font-weight: 700;
`;

const Home = () => {
  const dispatchStore = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const refresh = useSelector((state) => state.auth.refresh);
  const time = useSelector((state) => state.auth.time);
  const isLoading = useSelector((state) => state.loader.isLoading);
  const error = useSelector((state) => state.loader.error);

  const getToken = async (signal) => {
    dispatchStore(loaderActions.setIsLoading());
    dispatchStore(loaderActions.clearError());
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_KEY}`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ returnSecureToken: true });
    try {
      const res = await axios.post(url, body, { signal, headers });
      if (res.status === 200) {
        dispatchStore(
          authActions.setAuth({
            token: res.data.idToken,
            refresh: res.data.refreshToken,
            time: Date.now(),
          })
        );
      }
    } catch (err) {
      console.log(err);
      dispatchStore(loaderActions.setError({ name: err.name, message: err.message }));
    }
    dispatchStore(loaderActions.doneLoading());
  };

  const refreshToken = async (signal) => {
    dispatchStore(loaderActions.setIsLoading());
    dispatchStore(loaderActions.clearError());
    const url = `https://securetoken.googleapis.com/v1/token?key=${process.env.REACT_APP_FIREBASE_KEY}`;
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    const body = `grant_type=refresh_token&refresh_token=${refresh}`;
    try {
      const res = await axios.post(url, body, { signal, headers });
      console.log(res);
      if (res.status === 200) {
        console.log(res.data);
        dispatchStore(
          authActions.setAuth({
            token: res.data.id_token,
            refresh: res.data.refresh_token,
            time: Date.now(),
          })
        );
      }
    } catch (err) {
      dispatchStore(loaderActions.setError({ name: err.name, message: err.message }));
    }
    dispatchStore(loaderActions.doneLoading());
  };

  useEffect(() => {
    const controller = new AbortController();
    if (!refresh) getToken(controller.signal);
    else if (Date.now() - time > 3500000) refreshToken(controller.signal);
    return () => controller.abort();
    //eslint-disable-next-line
  }, []);

  const handleModalOkay = () => {
    dispatchStore(loaderActions.clearError());
    if (error.message !== "Invalid Password") window.location.reload(false);
  };

  return (
    <>
      {error && error.message !== "canceled" && (
        <ErrorModal
          title={error.name}
          message={error.message}
          onClick={handleModalOkay}
        ></ErrorModal>
      )}
      {isLoading && <LoadingSpinner show={isLoading} />}
      <Row className="align-content-center">
        <Col sm={12}>
          <StyledH1>Welcome to SandBox!</StyledH1>
        </Col>
      </Row>
      {token && <Login />}
    </>
  );
};

export default Home;
