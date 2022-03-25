import React, { useState, useEffect, useRef } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../components/store/user";
import { authActions } from "../components/store/auth";
import { chatActions } from "../components/store/chat";
import { loaderActions } from "../components/store/loader";
import LoadingSpinner from "../components/modals/LoadingSpinner";
import ErrorModal from "../components/modals/ErrorModal";
import Header from "../components/Header";
import Rooms from "../components/Rooms";
import axios from "axios";
import styled from "styled-components";

const StyledButton = styled(Button)`
  margin: 0;
  padding: 0;
  width: 28px;
  height: 28px;
  position: fixed;
  bottom: 7px;
  border: 2px;
  border-radius: 14px;
  text-aligment: center;
  font-size: 24px;
  line-height: 28px;

  .header & {
    bottom: initial;
    top: 7px;
  }
`;

const Chats = () => {
  const params = useParams();
  const dispatchStore = useDispatch();
  const rooms = useSelector((state) => state.chat.rooms);
  const login = useSelector((state) => state.user.login);
  const username = useSelector((state) => state.user.username);
  const token = useSelector((state) => state.auth.token);
  const refresh = useSelector((state) => state.auth.refresh);
  const time = useSelector((state) => state.auth.time);
  const isLoading = useSelector((state) => state.loader.isLoading);
  const error = useSelector((state) => state.loader.error);

  const [fetch, setFetch] = useState(true);
  // const fetchTimer = useRef(setTimeout(() => {}, 0));
  // let fetchTimer = setTimeout(() => {}, 0);
  const navigate = useNavigate();

  // console.log(refresh);

  const refreshToken = async () => {
    dispatchStore(loaderActions.setIsLoading());
    dispatchStore(loaderActions.clearError());
    const url = `https://securetoken.googleapis.com/v1/token?key=${process.env.REACT_APP_FIREBASE_KEY}`;
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    const body = `grant_type=refresh_token&refresh_token=${refresh}`;
    try {
      const res = await axios.post(url, body, { headers });
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

  const firebaseGet = async (param) => {
    const url = `https://firestore.googleapis.com/v1/projects/${process.env.REACT_APP_FIREBASE_PROJECT_ID}/databases/(default)/documents/${param}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    try {
      return await axios.get(url, { headers });
    } catch (err) {
      return err;
    }
  };

  const getRooms = async () => {
    dispatchStore(loaderActions.setIsLoading());
    dispatchStore(loaderActions.clearError());
    const param = `rooms`;
    try {
      const res = await firebaseGet(param);
      if (res.status === 200) {
        const roomArr = res.data.documents.map((msg, i) => ({
          lastMsg: msg.fields.lastMsg,
          id: msg.name.split("/").pop(),
        }));
        roomArr.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
        dispatchStore(chatActions.setRooms(roomArr));
      } else if (res.status === 429) dispatchStore(userActions.logout());
      else throw res;
    } catch (err) {
      dispatchStore(loaderActions.setError({ name: err.name, message: err.message }));
    }
    setFetch(false);
    dispatchStore(loaderActions.doneLoading());
  };

  useEffect(() => {
    // clearTimeout(fetchTimer);
    if (Date.now() - time > 3500000) refreshToken();
    if (login && fetch) {
      getRooms();
      // fetchTimer = setTimeout(() => {
      //   setFetch(true);
      // }, 3500000);
    }
    // return () => clearTimeout(fetchTimer);
    //eslint-disable-next-line
  }, [fetch]);

  const handleModalOkay = () => {
    dispatchStore(loaderActions.clearError());
  };

  return (
    <>
      {!login && <Navigate to="/" />}
      {error && error.message !== "canceled" && (
        <ErrorModal
          title={error.name}
          message={error.message}
          onClick={handleModalOkay}
        ></ErrorModal>
      )}
      {isLoading && <LoadingSpinner show={isLoading} />}

      <Container
        style={{
          position: "relative",
          height: "100%",
          padding: "40px 0",
        }}
      >
        {rooms && rooms.length > 0 && <Rooms>{params.user}</Rooms>}
        <Header className="header">
          {params.user}
          <StyledButton
            style={{ left: "13px" }}
            onClick={() => {
              dispatchStore(userActions.logout());
              navigate(`/`, { replace: true });
            }}
          >
            <i className="fa-solid fa-circle-arrow-left"></i>
          </StyledButton>
        </Header>
      </Container>
    </>
  );
};

export default Chats;
