import React from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import OptionsModal from "../components/modals/OptionsModel";
import styled from "styled-components";

const Window = styled(Container)`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 10px 0;
  background-color: white;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
`;
const Line = styled(Row)``;
const Msg = styled(Col)`
  margin: 3px 20px;
  padding: 0 8px;
  max-width: 60%;
  background-color: rgba(230, 230, 230, 1);
  border-radius: 20px;
  cursor: pointer;
  overflow: hidden;

  .justify-content-end & {
    background-color: #99ddff;
  }
`;
const Sender = styled.h6`
  cursor: default;
  font-size: 0.9em;
  text-align: left;
  padding: 0;
  margin: 12px auto 0 34px;
  color: blueviolet;
`;
const Text = styled.p`
  width: auto;
  text-align: left;
  overflow-wrap: break-word;

  span {
    font-size: 0.7em;
    font-weight: 600;
    color: #888;
    float: right;
    margin-left: 10px;
    margin-top: 0.7em;
  }
`;
const Reply = styled.p`
  width: auto;
  font-size: 0.8em;
  text-align: left;
  background: whitesmoke;
  margin: 0 -12px;
  padding: 6px 24px;
  overflow-wrap: break-word;
  box-shadow: inset 0 -1px 2px rgba(0, 0, 0, 0.2);
`;

const DateH6 = styled.h6`
  font-size: 0.9em;
  color: #666;
  border-top: 1px solid #ccc;
  margin-top: 12px;
`;

const MsgWindow = ({ setPopupOptions, onClick, children }) => {
  const messages = useSelector((state) => state.chat.messages);
  const username = useSelector((state) => state.user.username);

  return (
    <>
      {messages && (
        <Window>
          {messages.map((msg, i) => {
            const prevSender = i ? messages[i - 1].sender : "";
            const prevDate = i ? messages[i - 1].date : "";
            const content = (
              <>
                <Sender>{msg.sender}</Sender>
                <Msg>
                  <Text
                    dangerouslySetInnerHTML={{
                      __html: msg.text,
                    }}
                  ></Text>
                </Msg>
              </>
            );

            return (
              <div key={i}>
                {prevDate !== msg.date && <DateH6>{msg.date}</DateH6>}
                <Line
                  id={msg.id}
                  className={
                    msg.sender === username ? "justify-content-end" : "justify-content-start"
                  }
                >
                  {(prevSender !== msg.sender || prevDate !== msg.date) &&
                    msg.sender !== username && <Sender>{msg.sender}</Sender>}
                  <Msg xs="auto">
                    {msg.reply && messages.findIndex((m) => m.id === msg.reply) !== -1 && (
                      <Reply
                        onClick={() =>
                          document.getElementById(msg.reply).scrollIntoView({ behavior: "smooth" })
                        }
                      >
                        <b>{messages.find((m) => m.id === msg.reply).sender}</b>
                        {": "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: messages.find((m) => m.id === msg.reply).text,
                          }}
                        ></span>
                      </Reply>
                    )}
                    <Text
                      onClick={() => {
                        setPopupOptions(
                          <OptionsModal onClick={onClick} id={msg.id}>
                            {content}
                          </OptionsModal>
                        );
                      }}
                      dangerouslySetInnerHTML={{
                        __html: `${msg.text}
                      <span>${msg.time}</span>`,
                      }}
                    ></Text>
                  </Msg>
                </Line>
              </div>
            );
          })}
          {children}
        </Window>
      )}
    </>
  );
};

export default MsgWindow;
