import React from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
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
const Line = styled(Row)`
  a,
  :hover,
  :active {
    text-decoration: none !important;
  }
`;
const Item = styled(Col)`
  margin: 10px auto;
  padding: 0 8px;
  max-width: 80%;
  background-color: #99ddff;
  border-radius: 20px;
  cursor: pointer;
  overflow: hidden;
  height: 50px;
`;
const Room = styled.h5`
  padding: 0;
  margin: 0;
  color: #444;
  line-height: 50px;
  font-weight: 700;
  :hover {
    color: blueviolet !important;
  }
`;

const Rooms = ({ children }) => {
  const rooms = useSelector((state) => state.chat.rooms);

  return (
    <>
      {rooms && (
        <Window>
          {rooms.map((room, i) => {
            return (
              <Line key={i} id={room.id.replace(" ", "")} className="justify-content-ceter">
                <NavLink to={`/${children}/${room.id}`}>
                  <Item xs="auto">
                    <Room>{room.id}</Room>
                  </Item>
                </NavLink>
              </Line>
            );
          })}
        </Window>
      )}
    </>
  );
};

export default Rooms;
