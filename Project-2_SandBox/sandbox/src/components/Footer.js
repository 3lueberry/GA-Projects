import React from "react";
import { Row } from "react-bootstrap";
import styled from "styled-components";

const StyledRow = styled(Row)`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  margin: 0;
  padding: 5px 10px;
  background-image: linear-gradient(whitesmoke, white 30%, whitesmoke 100%);
  text-align: center;
  color: rgba(80, 80, 80, 1);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
`;

const Footer = ({ className, children }) => {
  return (
    <StyledRow className={`justify-content-center align-content-center ${className}`}>
      {children}
    </StyledRow>
  );
};

export default Footer;
