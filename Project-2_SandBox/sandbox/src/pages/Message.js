import React, { useState, useEffect, useRef } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../components/store/user";
import { authActions } from "../components/store/auth";
import { chatActions } from "../components/store/chat";
import { loaderActions } from "../components/store/loader";
import { Container, Row, Col, Button, Form, Overlay, Tooltip } from "react-bootstrap";
import axios from "axios";
import LoadingSpinner from "../components/modals/LoadingSpinner";
import ErrorModal from "../components/modals/ErrorModal";
import MsgWindow from "../components/MsgWindow";
import Footer from "../components/Footer";
import Header from "../components/Header";
import styled from "styled-components";

const StyledForm = styled(Form)`
  margin: 0;
  padding: 0;
  position: relative;
`;

const Input = styled(Form.Control)`
  width: 100%;
  min-height: 34px;
  line-height: 1.2em;
  border-radius: 17px;
  padding: 7px 36px 2px 36px;
  margin-bottom: -7px;
  resize: none;
  border: 0;
  box-shadow: inset 0 0 5px 1px rgba(0, 0, 0, 0.2);
`;

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

const StyledTooltip = styled(Tooltip)`
  transform: translate3d(8%, -38px, 0px) !important;
  cursor: pointer;
  width: 84%;

  .tooltip-inner {
    border-radius: 16px;
    padding: 6px 12px 8px 12px;
    width: 500px !important;
    max-width: 70%;
  }

  .tooltip-arrow {
    transform: translate3d(50px, 0px, 0px) !important;
  }

  p {
    padding: 0;
    text-align: left;
  }
`;

const EmojiTooltip = styled(Tooltip)`
  transform: translate3d(8%, -38px, 0px) !important;
  cursor: pointer;
  width: 84%;

  .tooltip-inner {
    border-radius: 16px;
    padding: 6px 12px 8px 12px;
    width: 500px !important;
    max-width: 70%;
  }

  .tooltip-arrow {
    transform: translate3d(50px, 0px, 0px) !important;
  }

  p {
    padding: 0;
    text-align: left;
  }
`;

const Message = () => {
  const params = useParams();
  const dispatchStore = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const pinned = useSelector((state) => state.chat.pinned);
  const textInput = useSelector((state) => state.chat.textInput);
  const textArea = useSelector((state) => state.chat.textArea);
  const username = useSelector((state) => state.user.username);
  const login = useSelector((state) => state.user.login);
  const token = useSelector((state) => state.auth.token);
  const refresh = useSelector((state) => state.auth.refresh);
  const time = useSelector((state) => state.auth.time);
  const isLoading = useSelector((state) => state.loader.isLoading);
  const error = useSelector((state) => state.loader.error);

  const emoji = ["😀", "😁", "😅", "🤣", "😘", "😜"];
  const [showEmoji, setShowEmoji] = useState(false);

  const [send, setSend] = useState(false);
  const [fetch, setFetch] = useState(true);
  const [newMsg, setNewMsg] = useState("");
  const [showPinned, setShowPinned] = useState(false);
  const [popupOptions, setPopupOptions] = useState("");
  const [reply, setReply] = useState("");
  const textInputRef = useRef();
  const scrollDown = useRef();
  const navigate = useNavigate();
  //   const fetchTimer = useRef(setTimeout(() => {}, 0));
  let fetchTimer = setTimeout(() => {}, 0);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatchStore(chatActions.textInputChange(textInput.trim()));
    if (textInput === "") textInputRef.current.focus();
    else {
      setSend(true);
    }
  };

  const firebaseGet = async (param) => {
    //     console.log("Firebase Fetch");
    const url = `https://firestore.googleapis.com/v1/projects/${process.env.REACT_APP_FIREBASE_PROJECT_ID}/databases/(default)/documents/${param}?pageSize=200`;
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

  const getMessages = async () => {
    if (showPinned) return setFetch(false);
    dispatchStore(loaderActions.setIsLoading());
    dispatchStore(loaderActions.clearError());
    const param = `rooms/${params.room}/messages`;
    try {
      const res = await firebaseGet(param);
      //   console.log(res.status);
      if (res.status === 200) {
        const msgArr = res.data.documents.map((msg, i) => ({
          sender: msg.fields.sender.stringValue,
          reply: msg.fields.reply.stringValue,
          text: msg.fields.text.stringValue,
          date: msg.fields.date.stringValue,
          time: msg.fields.time.stringValue,
          id: msg.name.split("/").pop(),
        }));
        msgArr.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
        dispatchStore(chatActions.setMessages(msgArr));
        if (msgArr[msgArr.length - 1].id !== newMsg) setNewMsg(msgArr[msgArr.length - 1].id);
      } else if (res.status === 429) dispatchStore(userActions.logout());
      else throw res;
    } catch (err) {
      dispatchStore(loaderActions.setError({ name: err.name, message: err.message }));
    }
    setFetch(false);
    dispatchStore(loaderActions.doneLoading());
  };

  const firebasePost = async (param, body) => {
    const url = `https://firestore.googleapis.com/v1/projects/${process.env.REACT_APP_FIREBASE_PROJECT_ID}/databases/(default)/documents/${param}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    try {
      return await axios.post(url, body, { headers });
    } catch (err) {
      return err;
    }
  };

  const sendMessages = async () => {
    dispatchStore(loaderActions.setIsLoading());
    dispatchStore(loaderActions.clearError());
    const time = Date.now() + 28800000;
    const param = `rooms/${params.room}/messages?documentId=${time}`;
    const body = JSON.stringify(
      {
        fields: {
          sender: {
            stringValue: username,
          },
          text: {
            stringValue: textInput.replace(/\n/gi, "<br />"),
          },
          reply: {
            stringValue: reply,
          },
          date: {
            stringValue: new Date(time).toISOString().split("T")[0],
          },
          time: {
            stringValue: new Date(time).toISOString().split("T")[1].substring(0, 5),
          },
        },
      },
      null,
      " "
    );
    try {
      const res = await firebasePost(param, body);
      if (res.status === 200) {
        dispatchStore(chatActions.textInputChange(""));
      } else throw res;
    } catch (err) {
      dispatchStore(loaderActions.setError({ name: err.name, message: err.message }));
    }
    setSend(false);
    clearTimeout(fetchTimer);
    setFetch(true);
    setReply("");
    dispatchStore(loaderActions.doneLoading());
  };

  const firebaseDelete = async (param) => {
    const url = `https://firestore.googleapis.com/v1/projects/${process.env.REACT_APP_FIREBASE_PROJECT_ID}/databases/(default)/documents/${param}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    try {
      return await axios.delete(url, { headers });
    } catch (err) {
      return err;
    }
  };

  const deleteMessages = async (id) => {
    dispatchStore(loaderActions.setIsLoading());
    dispatchStore(loaderActions.clearError());
    const param = `rooms/${params.room}/messages/${id}`;
    try {
      const res = await firebaseDelete(param);
      if (res.status === 200) {
        setFetch(true);
      } else throw res;
    } catch (err) {
      dispatchStore(loaderActions.setError({ name: err.name, message: err.message }));
    }
    dispatchStore(loaderActions.doneLoading());
  };

  useEffect(() => {
    if (login && fetch) {
      clearTimeout(fetchTimer);
      console.log("fetch");
      getMessages();
      fetchTimer = setTimeout(() => {
        // console.log("time up");
        setFetch(true);
      }, 30000);
    }
    if (Date.now() - time > 3500000) refreshToken();
    // return () => clearTimeout(fetchTimer);
    //eslint-disable-next-line
  }, [fetch]);

  useEffect(() => {
    if (login && send) {
      clearTimeout(fetchTimer);
      //   console.log("send");
      sendMessages();
    }
    //eslint-disable-next-line
  }, [send]);

  useEffect(() => {
    if (messages && messages.length > 0) scrollDown.current.scrollIntoView({ behavior: "smooth" });
    //eslint-disable-next-line
  }, [newMsg]);

  useEffect(() => {
    console.log(showPinned);
    if (showPinned && messages.length > 0) {
      clearTimeout(fetchTimer);
      getPinned();
    } else {
      setShowPinned(false);
      setFetch(true);
    }
    //eslint-disable-next-line
  }, [showPinned]);

  useEffect(() => {
    // console.log(pinned);
    if (pinned.length > 0 && login) sendPinned();
    //eslint-disable-next-line
  }, [pinned]);

  const getPinned = async (newPin = null) => {
    dispatchStore(loaderActions.setIsLoading());
    dispatchStore(loaderActions.clearError());
    const param = `rooms/${params.room}`;
    try {
      const res = await firebaseGet(param);
      //   console.log(res.status);
      if (res.status === 200) {
        const pinArr = res.data.fields.pinnedMsg.arrayValue.values.map((pin, i) => pin.stringValue);
        pinArr.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
        console.log(pinArr);
        dispatchStore(chatActions.setPinMsg(pinArr));
        if (newPin === null) {
          console.log(newPin);
          const msgArr = messages.filter((msg) => pinArr.includes(msg.id));
          dispatchStore(chatActions.setMessages(msgArr));
        } else {
          console.log(newPin);
          dispatchStore(chatActions.addPinMsg(newPin));
        }
      } else if (res.status === 429) dispatchStore(userActions.logout());
      else throw res;
    } catch (err) {
      dispatchStore(loaderActions.setError({ name: err.name, message: err.message }));
    }
    dispatchStore(loaderActions.doneLoading());
  };

  const firebasePatch = async (param, body) => {
    const url = `https://firestore.googleapis.com/v1/projects/${process.env.REACT_APP_FIREBASE_PROJECT_ID}/databases/(default)/documents/${param}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    try {
      return await axios.patch(url, body, { headers });
    } catch (err) {
      return err;
    }
  };

  const sendPinned = async () => {
    dispatchStore(loaderActions.setIsLoading());
    dispatchStore(loaderActions.clearError());
    const param = `rooms/${params.room}/?updateMask.fieldPaths=pinnedMsg`;
    let body = {
      fields: {
        pinnedMsg: {
          arrayValue: {
            values: [],
          },
        },
      },
    };
    body.fields.pinnedMsg.arrayValue.values = pinned.map((pin) => ({ stringValue: pin }));
    // body = JSON.stringify(body);
    console.log(body);
    try {
      const res = await firebasePatch(param, body);
      if (res.status === 200) {
        console.log(res);
      } else throw res;
    } catch (err) {
      dispatchStore(loaderActions.setError({ name: err.name, message: err.message }));
    }
    dispatchStore(loaderActions.doneLoading());
  };

  //   const enterSubmit = (e) => {
  //     if (e.key === "Enter" && !e.shiftKey && textInput !== "") {
  //       e.preventDefault();
  //       dispatchStore(chatActions.textInputChange(textInput.trim()));
  //       setSend(true);
  //     }
  //   };

  //   useEffect(() => {
  //     textInputRef.current.addEventListener("keyup", enterSubmit);
  //     return () => textInputRef.current.removeEventListener("keyup", enterSubmit);
  //   }, [textInputRef]);

  const handleMsgOptions = (option, element) => {
    console.log(option, element);
    switch (option) {
      case "reply":
        setReply(element);
        textInputRef.current.focus();
        break;
      case "pin":
        getPinned(element);
        // dispatchStore(chatActions.addPinMsg(element));
        break;
      case "delete":
        deleteMessages(element);
        break;
      default:
        break;
    }
    setPopupOptions("");
  };

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
      {popupOptions}
      <Container
        style={{
          position: "relative",
          height: "100%",
          padding: "40px 0",
        }}
      >
        {messages && messages.length > 0 && (
          <MsgWindow setPopupOptions={setPopupOptions} onClick={handleMsgOptions}>
            <div ref={scrollDown}></div>
          </MsgWindow>
        )}
        <Header className="header">
          {params.room}
          <StyledButton
            style={{ left: "13px" }}
            onClick={() => navigate(`/${username}`, { replace: true })}
          >
            <i className="fa-solid fa-circle-arrow-left"></i>
          </StyledButton>
          <StyledButton style={{ right: "13px" }} onClick={() => setShowPinned(!showPinned)}>
            <i className="fa-solid fa-map-pin"></i>
          </StyledButton>
        </Header>
        <Footer>
          {!showPinned && (
            <StyledForm id="sendForm" onSubmit={handleSubmit}>
              <Input
                as="textarea"
                rows={textArea}
                placeholder="Say something..."
                value={textInput}
                ref={textInputRef}
                onChange={(e) => dispatchStore(chatActions.textInputChange(e.target.value))}
              />
              {messages && reply && (
                <Overlay target={textInputRef.current} show={reply !== ""} placement="top">
                  {(props) => (
                    <StyledTooltip id="reply-tool-tip" {...props} onClick={() => setReply("")}>
                      {"replying to: "}
                      <b>{messages.find((msg) => msg.id === reply).sender}</b>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: `${messages.find((msg) => msg.id === reply).text}`,
                        }}
                      ></p>
                    </StyledTooltip>
                  )}
                </Overlay>
              )}
              <StyledButton style={{ left: "13px" }} onClick={() => setShowEmoji(!showEmoji)}>
                <i className="fa-regular fa-face-grin-beam"></i>
              </StyledButton>
              <StyledButton type="submit" style={{ right: "13px" }}>
                <i className="fa-regular fa-circle-up"></i>
              </StyledButton>

              {showEmoji && (
                <Overlay target={textInputRef.current} show={showEmoji} placement="top">
                  {(props) => (
                    <EmojiTooltip id="emoji-tool-tip" {...props}>
                      <Container>
                        <Row>
                          {emoji.map((emo, i) => {
                            return (
                              <Col
                                key={i}
                                xs={2}
                                onClick={() => {
                                  dispatchStore(
                                    chatActions.textInputChange(textInputRef.current.value + emo)
                                  );
                                  setShowEmoji(false);
                                }}
                              >
                                {emo}
                              </Col>
                            );
                          })}
                        </Row>
                      </Container>
                    </EmojiTooltip>
                  )}
                </Overlay>
              )}
            </StyledForm>
          )}
        </Footer>
      </Container>
    </>
  );
};

export default Message;
