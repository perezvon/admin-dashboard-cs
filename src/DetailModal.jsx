import React from "react";
import { UserDetails } from "./UserDetails";
import { Button, Layer } from "grommet";
import styled from "styled-components";

const StyledLayer = styled(Layer)`
  padding: 20px;
`;

export const DetailModal = ({
  modalTitle,
  modalData,
  showModal,
  openModal,
  closeModal,
  userDetails
}) =>
  showModal && (
    <StyledLayer bsSize="large" aria-labelledby="contained-modal-title-lg">
      <header>
        <h2>{modalTitle}</h2>
      </header>
      <main>
        {userDetails && <UserDetails userDetails={userDetails} />}
        <table className="table table-responsive table-bordered table-striped">
          <thead className="thead-default">
            <tr>
              <th>Product Number</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>QTY</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>{modalData}</tbody>
        </table>
      </main>
      <footer>
        <Button onClick={closeModal}>Close</Button>
      </footer>
    </StyledLayer>
  );
