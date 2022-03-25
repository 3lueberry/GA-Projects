import React from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.css";

const Overlay = (props) => {
  return (
    <>
      {props.show && (
        <div className={styles.backdrop}>
          <div className={`${styles.spinner} ${styles.modal}`}></div>
        </div>
      )}
    </>
  );
};

const LoadingSpinner = (props) => {
  return (
    <>{ReactDOM.createPortal(<Overlay {...props} />, document.querySelector("#modal-root"))}</>
  );
};

export default LoadingSpinner;
