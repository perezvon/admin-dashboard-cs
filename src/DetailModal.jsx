import React from "react";
import { UserDetails } from "./UserDetails";
import { Button, Layer, Table, TableHeader, TableBody, TableRow, TableCell } from "grommet";
import styled from "styled-components";

const StyledLayer = styled(Layer)`
  padding: 20px 30px 30px 30px;
`;

const CloseButton = styled(Button)`
  background: #f25454;
  color: white;
  border-radius: 100px;
  padding: 8px 15px;
  transition: background 0.3s;
  &:hover {
    background: #bc3232; 
  }
`

const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
`

export const DetailModal = ({
  modalTitle,
  modalData,
  showModal,
  setShowModal,
  userDetails
}) =>
  showModal && (
    <StyledLayer
      onEsc={() => setShowModal(false)}
      onClickOutside={() => setShowModal(false)}>
      <header>
        <h2>{modalTitle}</h2>
      </header>
      <main>
        {userDetails && <UserDetails userDetails={userDetails} />}
        <Table>
          <TableHeader className="thead-default">
            <TableRow>
              <TableCell>Product Number</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>QTY</TableCell>
              <TableCell>Subtotal</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>{modalData}</TableBody>
        </Table>
      </main>
      <Footer>
        <CloseButton onClick={() => setShowModal(false)}>Close</CloseButton>
      </Footer>
    </StyledLayer>
  );
