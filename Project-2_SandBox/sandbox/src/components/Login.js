import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "./store/user";
import { loaderActions } from "./store/loader";
import { Row, Col, Button, Form } from "react-bootstrap";
import axios from "axios";
import styled from "styled-components";

const Input = styled(Form.Control)`
  width: 90%;
  min-height: 42px;
  line-height: 1.2em;
  border-radius: 21px;
  padding: 6px 20px;
  margin: 10px 5%;
  resize: none;
  border: 0;
  box-shadow: inset 0 0 5px 1px rgba(0, 0, 0, 0.2);
`;

const StyledButton = styled(Button)`
  width: 90%;
  min-height: 42px;
  line-height: 1.2em;
  font-weight: 600;
  border-radius: 21px;
  margin: 10px 5%;
  border: 0;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);
`;

const Login = () => {
  const dispatchStore = useDispatch();
  const username = useSelector((state) => state.user.username);
  const login = useSelector((state) => state.user.login);
  const token = useSelector((state) => state.auth.token);

  const [submit, setSubmit] = useState({ clicked: false, newuser: false });
  const usernameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatchStore(userActions.usernameChange(username.trim()));
    if (username === "") usernameRef.current.focus();
    else {
      setSubmit({ clicked: true, newuser: false });
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    if (submit.clicked && !submit.newuser && username) loginFlow(controller.signal);
    else if (submit.clicked && submit.newuser && username) signupFlow(controller.signal);
    return () => controller.abort();
    //eslint-disable-next-line
  }, [submit]);

  const firebaseGet = async (param, signal) => {
    const url = `https://firestore.googleapis.com/v1/projects/${process.env.REACT_APP_FIREBASE_PROJECT_ID}/databases/(default)/documents/${param}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    try {
      return await axios.get(url, { signal, headers });
    } catch (err) {
      return err;
    }
  };

  const loginFlow = async (signal) => {
    dispatchStore(loaderActions.setIsLoading());
    dispatchStore(loaderActions.clearError());
    const param = `users/${username}`;
    try {
      const res = await firebaseGet(param, signal);
      if (res.status === 200) {
        if (passwordRef.current.value === res.data.fields.password.stringValue) {
          dispatchStore(userActions.login(res.data.fields.username.stringValue));
          setSubmit({ clicked: false, newuser: false });
        }
        throw new Error("Invalid Password");
      } else if (res.message === "Request failed with status code 404")
        setSubmit({ clicked: true, newuser: true });
      else throw res;
    } catch (err) {
      dispatchStore(loaderActions.setError({ name: err.name, message: err.message }));
    }
    dispatchStore(loaderActions.doneLoading());
  };

  const firebasePost = async (param, body, signal) => {
    const url = `https://firestore.googleapis.com/v1/projects/${process.env.REACT_APP_FIREBASE_PROJECT_ID}/databases/(default)/documents/${param}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    try {
      return await axios.post(url, body, { signal, headers });
    } catch (err) {
      return err;
    }
  };

  const signupFlow = async (signal) => {
    dispatchStore(loaderActions.setIsLoading());
    dispatchStore(loaderActions.clearError());
    const param = `users?documentId=${username}`;
    const body = {
      fields: {
        username: {
          stringValue: username,
        },
        password: {
          stringValue: passwordRef.current.value,
        },
      },
    };
    try {
      const res = await firebasePost(param, body, signal);
      if (res.status === 200) {
        dispatchStore(userActions.login(res.data.fields.username.stringValue));
        setSubmit({ clicked: false, newuser: false });
      } else throw res;
    } catch (err) {
      dispatchStore(loaderActions.setError({ name: err.name, message: err.message }));
    }
    dispatchStore(loaderActions.doneLoading());
  };

  useEffect(() => {
    if (login && username) navigate(`/${username}`, { replace: true });
    //eslint-disable-next-line
  }, [login]);

  return (
    <>
      <Form onSubmit={handleSubmit} style={{ marginBottom: "30vh" }}>
        <Row className="d-flex flex-row justify-content-center align-content-center">
          <Col sm={12}>
            <Input
              type="text"
              value={username}
              ref={usernameRef}
              placeholder="username"
              onChange={(e) => dispatchStore(userActions.usernameChange(e.target.value))}
            />
          </Col>
          <Col sm={12}>
            <Input type="password" ref={passwordRef} placeholder="password" />
          </Col>
          <Col sm={12}>
            <StyledButton type="submit" variant="primary">
              LOGIN
            </StyledButton>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Login;
