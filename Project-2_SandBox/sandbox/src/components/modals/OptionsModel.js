import React from "react";
import ReactDOM from "react-dom";
import { Col, Button } from "react-bootstrap";
import styles from "./Modal.module.css";

const Overlay = (props) => {
  return (
    <>
      <div className={styles.backdrop} onClick={props.onClick}>
        <div className={`${styles.board} ${styles.modal}`}>
          <header className={`${styles.header} ${styles.msgOptions}`}>{props.children}</header>
          <div className={styles.content}>
            <Button
              as={Col}
              xs={8}
              id="reply"
              className={`btn ${styles.btnOptions}`}
              onClick={(e) => {
                props.onClick(e.target.id, props.id);
              }}
            >
              Reply
            </Button>
            <Button
              as={Col}
              xs={8}
              id="pin"
              variant="success"
              className={`btn ${styles.btnOptions}`}
              onClick={(e) => {
                props.onClick(e.target.id, props.id);
              }}
            >
              Pin Message
            </Button>
            <Button
              as={Col}
              xs={8}
              id="delete"
              variant="danger"
              className={`btn ${styles.btnOptions}`}
              onClick={(e) => {
                props.onClick(e.target.id, props.id);
              }}
            >
              Delete
            </Button>
          </div>
          {/* <footer className={styles.actions}></footer> */}
        </div>
      </div>
    </>
  );
};

const OptionsModal = (props) => {
  return (
    <>{ReactDOM.createPortal(<Overlay {...props} />, document.querySelector("#modal-root"))}</>
  );
};

export default OptionsModal;
