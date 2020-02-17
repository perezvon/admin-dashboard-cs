import React from "react";
import { Table } from "./components/Table";
import { TextArea, TableRow, TableCell } from "grommet";
import { DetailModal } from "./DetailModal";
import { Button } from "grommet";

export default class ApproveDeny extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...this.props };
  }

  componentWillReceiveProps(props) {
    this.setState({
      ...props
    });
  }
  handleInput = (e, index) => {
    let field, value;
    if (e.target.type === "checkbox") {
      field = "approved";
      value = e.target.checked;
    } else {
      field = "approve_deny_notes";
      value = e.target.value;
    }
    const newData = this.state.data;
    newData[index] = { ...this.state.data[index], [field]: value };
    this.setState(prevState => ({
      ...prevState,
      data: newData
    }));
  };
  handleSubmit = e => {
    e.preventDefault();
    let data = [];
    this.state.data.forEach(o => {
      if (o.approved) o.status = "P";
      if (!o.approved) {
        o.approved = false;
        o.status = "D";
      }
      data.push(o);
    });
    //appears to automatically update and empty itself after updating status -- why?
    this.props.approveOrDenyOrders(data);
    //call to cs-cart api to update order statuses
  };

  render() {
    const {
      data,
      modalTitle,
      modalData,
      userDetails,
      showModal,
      setShowModal,
      modalLoading,
      setActiveOrder
    } = this.state;
    const headers = ["Order", "Name", "Total", "Approved?", "Notes"].map(i => (
      <td>{i}</td>
    ));
    const tableData = data.map((i, index) => (
      <TableRow key={i.order_id}>
        <TableCell onClick={setActiveOrder} data-order={i.order_id}>{i.order_id}</TableCell>
        <TableCell onClick={setActiveOrder} data-order={i.order_id}>
          {i.b_firstname ? i.b_firstname + " " + i.b_lastname : i.email}
        </TableCell>
        <TableCell onClick={setActiveOrder} data-order={i.order_id}>{`$${i.total}`}</TableCell>
        <TableCell>
          <label className="switch">
            <input
              type="checkbox"
              checked={i.approved}
              onChange={e => this.handleInput(e, index)}
            />
            <span className="slider round"></span>
          </label>
        </TableCell>
        <TableCell>
          <TextArea
            placeholder="Enter notes for employee here (optional)"
            value={i.approve_deny_notes}
            onChange={e => this.handleInput(e, index)}
          ></TextArea>
        </TableCell>
      </TableRow>
    ));
    if (data.length > 0) {
      return (
        <div>
          <Table headers={headers} tableData={tableData} />
          <Button onClick={this.handleSubmit}>Submit</Button>
          <DetailModal
            modalTitle={modalTitle}
            modalData={modalData}
            userDetails={userDetails}
            showModal={showModal}
            modalLoading={modalLoading}
            setShowModal={setShowModal}
          />
        </div>
      );
    } else {
      return <h3>No Orders to Approve!</h3>;
    }
  }
}
